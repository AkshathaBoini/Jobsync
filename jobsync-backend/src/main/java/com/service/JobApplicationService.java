package com.jobsync.jobsyncbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobsync.jobsyncbackend.dto.JobApplicationDto;
import com.jobsync.jobsyncbackend.model.JobApplication;
import com.jobsync.jobsyncbackend.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public JobApplication createApplication(String dataJson, MultipartFile resumeFile) {
        try {
            JobApplicationDto dto = objectMapper.readValue(dataJson, JobApplicationDto.class);

            JobApplication app = new JobApplication();
            app.setCompanyName(dto.getCompanyName());
            app.setJobTitle(dto.getJobTitle());
            app.setJobDescription(dto.getJobDescription());
            app.setStatus(dto.getStatus() != null ? dto.getStatus() : "Applied");
            app.setNotes(dto.getNotes());
            app.setAppliedDate(dto.getAppliedDate() != null ? dto.getAppliedDate() : LocalDate.now());
            app.setUpdatedDate(LocalDate.now());

            if (resumeFile != null && !resumeFile.isEmpty()) {
                String resumeText = extractTextFromPdf(resumeFile);
                app.setResumeText(resumeText);
            } else if (dto.getResumeText() != null) {
                app.setResumeText(dto.getResumeText());
            }

            analyzeWithAI(app);

            return repository.save(app);
        } catch (Exception e) {
            throw new RuntimeException("Error creating application: " + e.getMessage());
        }
    }

    private String extractTextFromPdf(MultipartFile file) {
        try {
            PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getBytes());
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();
            return text;
        } catch (Exception e) {
            System.out.println("PDF extraction error: " + e.getMessage());
            return "";
        }
    }

    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    public Optional<JobApplication> getApplicationById(Long id) {
        return repository.findById(id);
    }

    public JobApplication updateStatus(Long id, String status) {
        JobApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        app.setUpdatedDate(LocalDate.now());
        return repository.save(app);
    }

    public JobApplication updateNotes(Long id, String notes) {
        JobApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setNotes(notes);
        app.setUpdatedDate(LocalDate.now());
        return repository.save(app);
    }

    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }

    public Map<String, Long> getStats() {
        List<JobApplication> all = repository.findAll();
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) all.size());
        stats.put("applied", all.stream().filter(a -> "Applied".equals(a.getStatus())).count());
        stats.put("interview", all.stream().filter(a -> "Interview".equals(a.getStatus())).count());
        stats.put("offer", all.stream().filter(a -> "Offer".equals(a.getStatus())).count());
        stats.put("rejected", all.stream().filter(a -> "Rejected".equals(a.getStatus())).count());
        return stats;
    }

    private void analyzeWithAI(JobApplication app) {
        try {
            String jd = app.getJobDescription();
            String resume = app.getResumeText();
            if (jd != null && jd.length() > 2000) {
                jd = jd.substring(0, 2000);
            }
            if (resume != null && resume.length() > 2000) {
                resume = resume.substring(0, 2000);
            }

            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append("Analyze this job application. Respond ONLY with compact valid JSON, no markdown, no extra text, keep each text field under 200 characters. ");
            promptBuilder.append("Format exactly like this: ");
            promptBuilder.append("{\"matchScore\":<0-100>,\"missingKeywords\":\"<short comma list>\",\"aiSuggestions\":\"<brief 2 suggestions>\",\"interviewQuestions\":\"<2 short questions>\"} ");
            promptBuilder.append("Job Description: ").append(jd).append(" ");
            promptBuilder.append("Resume: ").append(resume);

            String prompt = promptBuilder.toString();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.1-8b-instant");
            body.put("max_tokens", 600);
            body.put("temperature", 0.1);
            body.put("response_format", Map.of("type", "json_object"));
            body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.groq.com/openai/v1/chat/completions", request, Map.class);

            if (response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                String content = (String) ((Map) choices.get(0).get("message")).get("content");

                content = content.trim();
                if (content.startsWith("```")) {
                    content = content.replaceAll("```json", "").replaceAll("```", "").trim();
                }

                Map<String, Object> parsed = objectMapper.readValue(content, Map.class);

                Object scoreObj = parsed.get("matchScore");
                if (scoreObj instanceof Integer) {
                    app.setMatchScore((Integer) scoreObj);
                } else if (scoreObj instanceof Number) {
                    app.setMatchScore(((Number) scoreObj).intValue());
                } else {
                    app.setMatchScore(0);
                }

                Object missing = parsed.get("missingKeywords");
                app.setMissingKeywords(missing != null ? missing.toString() : "");

                Object suggestions = parsed.get("aiSuggestions");
                app.setAiSuggestions(suggestions != null ? suggestions.toString() : "No suggestions available.");

                Object questions = parsed.get("interviewQuestions");
                app.setInterviewQuestions(questions != null ? questions.toString() : "");
            }
        } catch (Exception e) {
            System.out.println("GROQ ERROR: " + e.getMessage());
            e.printStackTrace();
            if (app.getMatchScore() == null) {
                app.setMatchScore(0);
            }
            if (app.getAiSuggestions() == null) {
                app.setAiSuggestions("AI analysis unavailable at the moment.");
            }
        }
    }
}