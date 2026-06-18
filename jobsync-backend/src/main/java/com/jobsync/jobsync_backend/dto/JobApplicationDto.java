package com.jobsync.jobsyncbackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JobApplicationDto {
    private String companyName;
    private String jobTitle;
    private String jobDescription;
    private String resumeText;
    private String status;
    private String notes;
    private LocalDate appliedDate;
}