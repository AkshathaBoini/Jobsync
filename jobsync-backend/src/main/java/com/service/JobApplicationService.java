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

            // Extract text from PDF if uploaded
            if (resumeFile != null && !resumeFile.isEmpty()) {
                String resumeText = extractTextFromPdf(resumeFile);
                app.setResumeText(resumeText);
            } else if (dto.getResumeText() != null) {
                app.setResumeText(dto.getResumeText());
            }

            // AI Analysis
            analyzeWithAI(app);

            return repository.save(app);
        } catch (Exception e) {
            throw new RuntimeException("Error creating application: " + e.getMessage());
        }
    }

    private String extractTextFromPdf(MultipartFile file) {
    try {
        org.apache.pdfbox.Loader loader = org.apache.pdfbox.Loader.class.cast(null);
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
            String prompt = String.format("""
                Analyze this job application and respond ONLY with valid JSON, no extra text, no markdown:
                {
                  "matchScore": <number between 0 and 100>,
                  "missingKeywords": "<comma separated missing skills>",
                  "aiSuggestions": "<2-3 specific suggestions>",
                  "interviewQuestions": "<3 likely interview questions>"
                }
                
                Job Description: %s
                
                Resume: %s
                """, app.getJobDescription(), app.getResumeText());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.1-8b-instant");
            body.put("max_tokens", 500);
            body.put("temperature", 0.1);
            body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.groq.com/openai/v1/chat/completions", request, Map.class);

            if (response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                String content = (String) ((Map) choices.get(0).get("message")).get("content");

                content = content.trim();
                // Remove markdown code blocks if present
                if (content.startsWith("```")) {
                    content = content.replaceAll("```json", "").replaceAll("```", "").trim();
                }

                if (content.startsWith("{")) {
                    Map<String, Object> parsed = objectMapper.readValue(content, Map.class);
                    app.setMatchScore(parsed.get("matchScore") instanceof Integer ?
                        (Integer) parsed.get("matchScore") :
                        ((Number) parsed.get("matchScore")).intValue());
                    app.setMissingKeywords((String) parsed.get("missingKeywords"));
                    app.setAiSuggestions((String) parsed.get("aiSuggestions"));
                    app.setInterviewQuestions((String) parsed.get("interviewQuestions"));
                }
            }
        } catch (Exception e) {
            System.out.println("GROQ ERROR: " + e.getMessage());
            e.printStackTrace();
            app.setMatchScore(0);
            app.setAiSuggestions("AI analysis unavailable at the moment.");
        }
    }
}