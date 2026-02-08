NeuroQuery 🧠
<div align="center">
cd C:\Users\R c\Desktop\neuroquery\frontend\public\neuroquery-logo.jpg

Intelligent RAG-Powered Query System

https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi
https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white
https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue

https://img.shields.io/badge/License-MIT-yellow.svg
https://img.shields.io/badge/PRs-welcome-brightgreen.svg
https://badges.frapsoft.com/os/v2/open-source.svg?v=103

</div>
📖 Table

NeuroQuery 🧠
🚀 Intelligent RAG-Powered Query System
NeuroQuery is a production-ready, full-stack web application that demonstrates a complete Retrieval-Augmented Generation (RAG) pipeline with exceptional UI/UX design that showcases modern AI/ML engineering, full-stack development skills, and professional application architecture.

✨ Features
🎨 Exceptional User Experience
Animated Splash Screen: Neural network visualization with progress tracking

Modern Authentication: Beautiful login/register flows with particle animations

Interactive Dashboard: Real-time RAG pipeline visualization

Responsive Design: Fully optimized for all device sizes

🤖 Complete RAG Pipeline
Document Processing: Smart chunking and embedding generation

Semantic Search: FAISS-based vector similarity search

Context-Aware Answers: AI-generated responses with source citation

Pipeline Visualization: Step-by-step visualization of RAG operations

🔧 Technical Excellence
Production Architecture: Dockerized microservices with proper separation

Secure Authentication: JWT-based auth with password hashing

Database Integration: SQLAlchemy ORM with SQLite/PostgreSQL

Real-time Updates: WebSocket-like experience with React state management

🏗️ Architecture
text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend│────▶│  FastAPI Backend│────▶│  RAG Pipeline   │
│   (Port: 3000)  │     │   (Port: 8000)  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Interface│     │   REST API      │     │   FAISS Vector  │
│   Components    │     │   Endpoints     │     │   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
📁 Project Structure
text
neuroquery/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   ├── auth.py            # Authentication logic
│   │   ├── rag_pipeline.py    # Core RAG implementation
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── database.py        # Database configuration
│   │   └── config.py          # Application settings
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container config
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── SplashScreen.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── RAGPipeline.jsx
│   │   ├── services/          # API services
│   │   ├── styles/           # CSS modules
│   │   └── App.jsx           # Main React app
│   ├── package.json          # Node dependencies
│   └── Dockerfile           # Frontend container config
│
├── docker-compose.yml        # Multi-container setup
└── README.md                # This file
🛠️ Tech Stack
Backend
FastAPI: Modern, fast web framework for APIs

SQLAlchemy: Python SQL toolkit and ORM

JWT: Secure authentication with JSON Web Tokens

LangChain: Document processing and chunking

Sentence Transformers: Text embedding generation

FAISS: Vector similarity search library

Frontend
React 18: Frontend library with hooks

Framer Motion: Advanced animations

React Router: Navigation and routing

Axios: HTTP client for API calls

Styled Components: CSS-in-JS styling

React Icons: Icon library

DevOps & Tools
Docker: Containerization

Docker Compose: Multi-container orchestration

SQLite: Development database (PostgreSQL ready)

Pydantic: Data validation

Black: Code formatting

🚀 Quick Start
Prerequisites
Python 3.9+

Node.js 16+

Docker & Docker Compose (optional)

Git

Installation
Option 1: Using Docker (Recommended)
bash
# Clone the repository
git clone https://github.com/RubabTalha/neuroquery.git
cd neuroquery

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
Option 2: Manual Setup
Backend Setup:

bash
cd backend
python -m venv venv
source venv/bin/activate  # Its On Linux,  For Windows: venv\Scripts\activate
pip install -r requirements.txt

# Initialize database
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Frontend Setup:

bash
cd frontend
npm install
npm start
📊 RAG Pipeline Flow
text
1. Document Upload
   ↓
2. Text Extraction & Chunking
   ↓
3. Embedding Generation (Sentence Transformers)
   ↓
4. Vector Storage (FAISS Index)
   ↓
5. User Query → Embedding
   ↓
6. Semantic Search in Vector DB
   ↓
7. Context Retrieval & Ranking
   ↓
8. Answer Generation with Sources
   ↓
9. Response Display with Visualization
🔐 Authentication Flow
text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Splash    │────▶│   Login/    │────▶│   JWT Token │
│   Screen    │     │   Register  │     │   Generation│
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Protected  │◀────│   API Calls │◀────│   Dashboard │
│   Routes    │     │  with Token │     │   Access    │
└─────────────┘     └─────────────┘     └─────────────┘
🎯 API Endpoints
Authentication
POST /register - User registration

POST /token - Login and get JWT token

Documents
POST /upload-document - Upload and process documents

GET /documents - List user's documents

RAG Operations
POST /query - Query the RAG pipeline

GET /query-history - Get query history

Health
GET /health - Service health check

🎨 UI Components
1. Splash Screen
Neural network animation

Progress tracking

Feature highlights

Smooth transitions to login

2. Authentication Screens
Particle background effects

Form validation

Smooth state transitions

Responsive design

3. Dashboard
Sidebar navigation

Real-time statistics

Interactive RAG pipeline visualization

Document management interface

Query history tracking

4. RAG Pipeline Component
Live query processing visualization

Source document highlighting

Answer generation animation

Performance metrics display

🧪 Testing
bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm test
🔧 Configuration
Environment Variables
Create .env file in backend directory:

env
# Application
APP_NAME=NeuroQuery
DEBUG=False

# Database
DATABASE_URL=sqlite:///./neuroquery.db

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# RAG
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
📈 Performance Metrics
Document Processing: ~1000 words/second

Query Response Time: < 2 seconds average

Vector Search: Sub-second similarity search

Concurrent Users: Scalable architecture supports 100+ users

🚢 Deployment
Docker Deployment
bash
# Build and push to registry
docker-compose build
docker tag neuroquery-frontend yourregistry/neuroquery-frontend:latest
docker tag neuroquery-backend yourregistry/neuroquery-backend:latest
docker push yourregistry/neuroquery-frontend:latest
docker push yourregistry/neuroquery-backend:latest

# Deploy with docker-compose
docker-compose up -d
Cloud Deployment (AWS Example)
bash
# ECS/Fargate deployment
aws ecs create-service --cluster neuroquery-cluster \
  --service-name neuroquery-service \
  --task-definition neuroquery-task \
  --desired-count 2
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow PEP 8 for Python code

Use ESLint for JavaScript/React

Write unit tests for new features

Update documentation as needed

📚 Learning Resources
RAG Concepts: https://aws.amazon.com/what-is/retrieval-augmented-generation/
Retrieval-Augmented Generation Paper: https://arxiv.org/abs/2005.11401

Vector Databases Explained: https://www.datacamp.com/tutorial/introduction-to-vector-databases-for-machine-learning?utm_cid=19589720824&utm_aid=157156376071&utm_campaign=230119_1-ps-other~dsa-tofu~all_2-b2c_3-apac_4-prc_5-na_6-na_7-le_8-pdsh-go_9-nb-e_10-na_11-na&utm_loc=1011082-&utm_mtd=-c&utm_kw=&utm_source=google&utm_medium=paid_search&utm_content=ps-other~apac-en~dsa~tofu~tutorial~machine-learning&gad_source=1&gad_campaignid=19589720824&gbraid=0AAAAADQ9WsFVx3OJK6zuunXTNFanFEEny&gclid=Cj0KCQiA4pvMBhDYARIsAGfgwvzzYVvPmBcZMWTnTHunxvocAgVFzsAf7aswVVV8bbuTwKyLZCKmsDQaAqRnEALw_wcB

Sentence Transformers Documentation: https://sbert.net/

Technologies Used
FastAPI Documentation: https://fastapi.tiangolo.com/

React Documentation: https://react.dev/learn

Docker Documentation: https://docs.docker.com/get-started/

🏆 Project Highlights
Demonstrates Expertise In:
✅ End-to-end AI/ML system development

✅ Production-grade application architecture

✅ Modern full-stack development (React + FastAPI)

✅ Vector databases and semantic search

✅ Professional UI/UX design implementation

✅ Secure authentication and authorization

✅ Docker containerization and deployment

✅ Real-time data visualization

✅ Clean, maintainable code structure

✅ Comprehensive documentation

Differentiators:
-> Not just a model: Complete application with UI, auth, database

-> Production ready: Dockerized, scalable, error handling

-> Educational: Clear visualization of complex RAG concepts

-> Professional: Code quality, testing, documentation

-> Extensible: Modular architecture for easy enhancements

🛡️ License
This project is licensed under the MIT License - see the LICENSE file for details.

  Acknowledgments
Sentence Transformers for embedding models

FAISS for vector similarity search

LangChain for RAG framework

FastAPI for the awesome web framework

React for the frontend library

✨ Show Your Support
Give a ⭐️ if this project helped you or impressed you!

<div align="center">
Built with ❤️ by RubabTalha


</div>
🎥 Demo Video
Video Link: 