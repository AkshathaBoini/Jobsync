package com.jobsync.jobsyncbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    private String status;
    private Integer matchScore;

    @Column(columnDefinition = "TEXT")
    private String missingKeywords;

    @Column(columnDefinition = "TEXT")
    private String aiSuggestions;

    @Column(columnDefinition = "TEXT")
    private String interviewQuestions;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDate appliedDate;
    private LocalDate updatedDate;
}