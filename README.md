# SentinelAI 🛡️

### AI-Powered Digital Public Safety Platform

SentinelAI is an AI-powered digital safety platform designed to help users identify and respond to **online scams, fraud, counterfeit currency, and suspicious digital activity**.

The platform combines artificial intelligence, fraud intelligence, secure reporting  to provide a centralized system for improving digital awareness and public safety.

---

## 🚀 Key Features

### 🔍 AI Scam Detection

Analyze suspicious messages, links, and online content to identify potential scams.

The system provides:

* Scam classification
* Risk assessment
* Suspicious indicators
* Explanation of detected risks
* Recommended safety actions

### 💬 AI Safety Assistant

SentinelAI includes an AI-powered chatbot that helps users understand suspicious situations and provides safety guidance.

Users can ask questions such as:

```text
"Is this message a scam?"
"Someone is asking me to share my OTP. What should I do?"
"How can I identify a fake payment request?"
```

### 💰 Counterfeit Currency Detection

The platform can be extended with an AI-based currency detection module to identify potentially counterfeit banknotes using image analysis.

Possible outputs include:

* Currency denomination
* Authenticity prediction
* Confidence score
* Suspicious visual features

### 🚨 Fraud Reporting

Users can submit suspicious incidents through the reporting system.

Reports can contain:

* Fraud category
* Description
* Transaction information
* Suspicious contact details
* Evidence or supporting information

### 🕸️ Fraud Network Intelligence

SentinelAI can represent relationships between suspicious entities as a network graph.

Example:

```text
                Suspicious Account
                       |
             ┌─────────┼─────────┐
             ↓         ↓         ↓
          Phone      Email     UPI ID
             |         |         |
             └─────┬───┴─────┬───┘
                   ↓         ↓
              Victim A    Victim B
```

This can help investigators identify connections and recurring fraud patterns.



### 📊 Dashboard

The dashboard provides an overview of security and fraud-related activity, including:

* Scam analyses
* Fraud reports
* Risk indicators
* Investigation information
* System statistics

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ React + Vite        │
                         │ Frontend            │
                         └──────────┬──────────┘
                                    │
                               REST APIs
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ FastAPI Backend     │
                         ├─────────────────────┤
                         │ Authentication      │
                         │ Scam Detection      │
                         │ Fraud Reports       │
                         │ Chatbot             │
                         │ RBAC                │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌─────────────────┐
        │ MySQL Database │ │ Gemini / AI    │ │ Fraud           │
        │                │ │ Services       │ │ Intelligence    │
        └────────────────┘ └────────────────┘ └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* TypeScript
* React Router
* Tailwind CSS
* Axios

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* JWT Authentication
* Role-Based Access Control

### Database

* MySQL

### AI

* Google Gemini API
* Machine Learning / AI-based classification
* Image analysis for future counterfeit detection

### Development Tools

* Git
* GitHub
* VS Code
* MySQL Workbench
* Postman

---

## 📁 Project Structure

```text
sentinel_ai/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── auth.py
│   │   ├── scam.py
│   │   ├── reports.py
│   │   └── chatbot.py
│   ├── models/
│   ├── services/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sushmitha-k0611/sentinelai.git
cd sentinel_ai
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## 🔑 Environment Configuration

Sensitive credentials must **never be committed to GitHub**.

Create a local environment file such as:

```text
backend/.env
```

Example:

```env
GEMINI_API_KEY=your_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

Keep the `.env` file in `.gitignore`.

For production, use secure environment variables or a secrets-management solution.

---

## 🔐 Security

SentinelAI uses security mechanisms such as:

* JWT-based authentication
* Password hashing
* Role-based authorization
* Protected API endpoints
* Frontend route protection
* Environment-based secret management

Public users cannot select privileged roles during registration.

---

## 🔄 Application Workflow

```text
User
  ↓
Login / Registration
  ↓
Citizen Dashboard
  ↓
Submit Suspicious Content
  ↓
AI Scam Analysis
  ↓
Risk Assessment
  ↓
Safety Recommendation
  ↓
Optional Fraud Report
  ↓
Investigator Review
  ↓
Fraud Intelligence
```

---

## 🎯 Problem Statement

The rapid growth of digital payments and online communication has increased exposure to:

* Phishing
* Online payment fraud
* Impersonation scams
* Digital arrest scams
* Fake investment schemes
* Counterfeit currency
* Social engineering attacks

Many users cannot easily determine whether a suspicious message, payment request, or online interaction is legitimate.

SentinelAI aims to provide an accessible AI-assisted platform that helps users **detect, understand, report, and investigate digital threats**.

---

## 💡 Objectives

1. Detect suspicious digital content using AI.
2. Provide understandable explanations of scam indicators.
3. Help citizens report fraudulent incidents.
4. Support investigators with structured fraud information.
5. Protect the application using authentication and RBAC.
6. Build a foundation for network-based fraud intelligence.
7. Improve public awareness of common digital scams.

---

## 📈 Future Enhancements

* Advanced counterfeit currency image classification
* Real-time fraud network visualization
* Multilingual scam detection
* Voice-based safety assistant
* SMS and email integration
* Explainable AI for predictions
* Real-time threat intelligence
* Mobile application
* Cloud deployment
* Advanced investigator analytics
* Role based Access

---

## 🌟 Impact

SentinelAI is designed to bridge the gap between **AI technology and digital public safety** by helping ordinary users recognize suspicious activity while giving investigators structured information for further analysis.

The platform can serve as a foundation for future integration with broader fraud-intelligence and digital safety ecosystems.

---

## 👩‍💻 Author

**Sushmitha K**

AI/ML & Full-Stack Developer

GitHub: [@sushmitha-k0611](https://github.com/sushmitha-k0611)

---

## 📜 License

This project is developed for educational, research, and hackathon purposes.
