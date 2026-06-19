# JobSync 🎯

**AI-Powered Job Application Tracker**

JobSync is a full-stack job hunt command center that helps you track applications, analyze resume-to-job match scores using AI, and prepare for interviews — all in one place.

## ✨ Features

- 📄 **PDF Resume Upload** — Upload your resume directly, no copy-pasting text
- 🤖 **AI Match Analysis** — Powered by Groq's LLaMA model, get instant match scores between your resume and job descriptions
- 🔍 **Missing Keywords Detection** — See exactly what skills/keywords your resume is missing for a specific role
- 💡 **AI Suggestions** — Get actionable advice to improve your application
- 🎯 **Likely Interview Questions** — AI-generated interview prep based on the job description and your background
- 📊 **Application Dashboard** — Track status (Applied, Interview, Offer, Rejected) with visual pipeline and stats
- 📝 **Notes** — Keep recruiter details, salary discussions, and interview feedback organized

## 🛠️ Tech Stack

**Backend**
- Java 21 + Spring Boot
- PostgreSQL
- Apache PDFBox (PDF text extraction)
- Groq AI API (LLaMA 3.1)
- Docker

**Frontend**
- React.js
- Axios
- React Router

**Deployment**
- Backend: Render
- Frontend: Vercel
- Database: Neon (Serverless PostgreSQL)

## 🚀 Getting Started

### Backend
```bash
cd jobsync-backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd jobsync-frontend
npm install
npm start
```

### Environment Variables

**Backend** (`application.properties`):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobsync
spring.datasource.username=postgres
spring.datasource.password=your_password
groq.api.key=your_groq_api_key
```

**Frontend** (`.env`):
```
REACT_APP_API_URL=http://localhost:8080
```

## 📸 Screenshots

*Dashboard with application pipeline and stats*

*AI-powered match analysis with missing keywords, suggestions, and interview prep*

## 👩‍💻 Author

**Akshatha Boini**
[LinkedIn](https://linkedin.com/in/akshathaboini) | [GitHub](https://github.com/AkshathaBoini)
