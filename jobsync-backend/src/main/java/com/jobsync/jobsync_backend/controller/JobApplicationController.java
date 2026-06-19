package com.jobsync.jobsyncbackend.controller;

import com.jobsync.jobsyncbackend.dto.JobApplicationDto;
import com.jobsync.jobsyncbackend.model.JobApplication;
import com.jobsync.jobsyncbackend.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:3000", "https://jobsync-kappa.vercel.app", "https://jobsync-tau.vercel.app"})
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService service;

    @PostMapping
    public ResponseEntity<JobApplication> create(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "resume", required = false) MultipartFile resumeFile) {
        return ResponseEntity.ok(service.createApplication(dataJson, resumeFile));
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAll() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getById(@PathVariable Long id) {
        return service.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateStatus(id, body.get("status")));
    }

    @PatchMapping("/{id}/notes")
    public ResponseEntity<JobApplication> updateNotes(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateNotes(id, body.get("notes")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }
}