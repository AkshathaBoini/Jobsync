# 🎯 JobSync
An AI-powered job application tracker that helps you manage your job hunt, analyze resume-to-job match scores, and prepare for interviews — all in one place.

## 🚀 Features
- PDF resume upload with automatic text extraction
- AI-powered match score between resume and job description
- Missing keywords detection for each job application
- AI-generated suggestions to improve your application
- AI-generated likely interview questions based on the job and resume
- Application dashboard with status tracking (Applied, Interview, Offer, Rejected)
- Visual pipeline and success rate statistics
- Notes section for recruiter details and interview feedback

## 🛠️ Tech Stack
- Java 21 + Spring Boot — backend REST APIs
- React.js — frontend
- PostgreSQL — database
- Apache PDFBox — PDF text extraction
- Groq AI (LLaMA 3.1) — AI match analysis
- Docker — containerized backend deployment
- Axios + React Router — frontend data handling and routing

## 📁 File Structure
- **jobsync-backend** — Spring Boot REST API, AI analysis service, PostgreSQL integration
- **jobsync-frontend** — React dashboard, application form, AI analysis display
- **JobApplicationController.java** — REST endpoints for applications
- **JobApplicationService.java** — business logic, PDF parsing, Groq AI integration
- **Dashboard.js** — main dashboard with stats and application list
- **AddApplication.js** — form to add new applications with PDF upload
- **ApplicationDetail.js** — detailed view with AI analysis and notes

## 🔍 How It Works
1. User enters company name, job title, and pastes the job description
2. User uploads their resume as a PDF
3. Backend extracts text from the PDF using Apache PDFBox
4. Job description and resume text are sent to Groq's LLaMA model
5. AI returns a match score, missing keywords, suggestions, and interview questions
6. Results are displayed instantly on the application detail page
7. User can update application status and add notes as the process progresses

## 📊 AI Match Score
- **90–100%** — Excellent match, strong alignment with job requirements
- **70–89%** — Good match, minor gaps in keywords or experience
- **50–69%** — Fair match, several missing skills or keywords
- **Below 50%** — Significant gaps, consider tailoring resume further

## ⚙️ Installation

**Backend**
```
cd jobsync-backend
./mvnw clean install
```

**Frontend**
```
cd jobsync-frontend
npm install
```

## ▶️ Run

**Backend**
```
./mvnw spring-boot:run
```

**Frontend**
```
npm start
```

## 🌐 Environment Variables

**Backend** (`application.properties`)
```
spring.datasource.url=jdbc:postgresql://localhost:5432/jobsync
spring.datasource.username=postgres
spring.datasource.password=your_password
groq.api.key=your_groq_api_key
```

**Frontend** (`.env`)
```
REACT_APP_API_URL=http://localhost:8080
```

## 👩‍💻 Author
**Akshatha Boini**
[LinkedIn](https://linkedin.com/in/akshathaboini) · [GitHub](https://github.com/AkshathaBoini)
