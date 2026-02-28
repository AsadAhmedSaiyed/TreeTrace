# 🌳 TreeTrace: Intelligent Environmental Surveillance & Monitoring

[![Production Ready](https://img.shields.io/badge/status-production--ready-success.svg)](#)
[![Kubernetes](https://img.shields.io/badge/deployed-AKS-blue.svg)](#)
[![Monitoring](https://img.shields.io/badge/monitoring-Prometheus%20%26%20Grafana-orange.svg)](#)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

**TreeTrace** is a next-generation environmental surveillance platform designed to combat deforestation and catalyze reforestation efforts using Satellite Intelligence (GEE), Multi-Agent AI, and Cloud-Native Infrastructure.

---

## 🎯 Problem Statement (The "Why")

Deforestation is occurring at an alarming rate, often driven by illegal logging and land encroachment in remote areas where physical monitoring is impossible. 

### The Challenges:
1. **Visibility Gap**: Large-scale environmental changes often go unnoticed until it's too late.
2. **Data Fragmentation**: Satellite data is complex and inaccessible to local communities and NGOs.
3. **Delayed Action**: The gap between detecting environmental damage and taking action (NGO intervention/legal reporting) is too wide.
4. **Accountability**: Lack of a centralized platform to verify reforestation promises and monitor tree health over time.

### The TreeTrace Solution:
TreeTrace bridges this gap by providing a **real-time verification and alert system**. We transform raw satellite imagery into actionable intelligence, enabling community members to report incidents and NGOs to respond with data-backed priority.

---

## 🚀 Key Features

- **🛰️ Satellite Intelligence**: Integrated with **Google Earth Engine (GEE)** to analyze vegetation indices (NDVI) and detect forest loss.
- **🤖 AI-Powered Analysis**: Uses **Azure OpenAI (GPT-4o)** to process community reports, summarize environmental impact, and provide strategic recommendations.
- **📍 Hyper-Local Response**: Geo-spatial indexing to connect reports with the nearest registered NGOs for immediate action.
- **🛡️ Secure Identity**: Enterprise-grade authentication via **Clerk**.
- **📈 Comprehensive Monitoring**: 24/7 observability with Prometheus and Grafana for a high-availability backend.
- **☁️ Cloud Native**: Fully containerized with Docker and orchestrated on **Azure Kubernetes Service (AKS)** for 99.9% uptime.

---

## 🛠️ Tech Stack

### Frontend & UI
- **React (Vite)**: For a lightning-fast, modern UI.
- **Tailwind CSS**: Utility-first styling for a premium, responsive design.
- **Framer Motion**: Smooth micro-animations and transitions.
- **Clerk**: Secure, seamless user authentication.

### Backend & AI
- **Node.js (Express)**: Scalable, event-driven API layer.
- **MongoDB (Mongoose)**: Robust document-oriented data storage.
- **Google Earth Engine (GEE)**: Core spatial analysis engine for satellite imagery.
- **Azure OpenAI SDK**: Multi-agent AI for report analysis and intelligent insights.
- **Cloudinary**: Optimized media storage for ground-level photographic evidence.
- **Resend**: Automated transactional email alerts to NGOs and Users.

### Infrastructure & DevOps
- **Docker**: Containerization for environment parity.
- **AKS (Azure Kubernetes Service)**: Managed K8s for high availability and auto-scaling.
- **Prometheus**: Real-time metric collection and monitoring.
- **Grafana**: Advanced visualization dashboards for system health.
- **Vercel**: High-performance frontend hosting.

---

## 🏗️ Architecture & Flow

1. **Detection**: User or Satellite (GEE) detects a change in vegetation canopy.
2. **Reporting**: Community members upload ground truth (images + location) via the TreeTrace frontend.
3. **Processing**: Backend orchestrates GEE analysis and triggers AI agents to assess report validity and impact.
4. **Action**: Automatic notification sent to the nearest NGO via Resend; entry logged in MongoDB.
5. **Observability**: Prometheus tracks request latencies and error rates, visualized in Grafana.

---

## 📦 Containerization & Orchestration

TreeTrace follows a microservices-aligned architecture designed for **Zero-Downtime**.

### Docker Strategy
The backend is containerized for consistent deployment across environments.
```bash
docker build -t asad313/treetrace-backend .
```

### Kubernetes (AKS) Deployment
Utilizing AKS for robust orchestration, we implement:
- **Rolling Updates**: Ensures newer versions are deployed without dropping existing traffic.
- **Liveness/Readiness Probes**: Automatic self-healing if a container becomes unhealthy.
- **Horizontal Pod Autoscaling (HPA)**: Automatically scales pods based on CPU/Memory metrics.

Files located in `backend/k8s-specifications/`.

---

## 📊 Monitoring & Observability

We prioritize **High Availability** and **Performance**.

- **Prometheus**: Scrapes `/metrics` endpoint to collect Node.js runtime metrics, HTTP request durations, and GEE latency.
- **Grafana**: Provides a "Single Pane of Glass" for:
    - Request success/failure rates.
    - System resource utilization (CPU/RAM).
    - Database connection health.
- **Zero Downtime**: Real-time alerts configured to notify the SRE team before issues affect end-users.

---

## 🛠️ Getting Started

### Local Setup
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/AsadAhmedSaiyed/TreeTrace.git
   ```
2. **Install Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Environment Variables**: Create `.env` files based on the project structure (Clerk keys, MongoDB URI, GEE JSON credentials, Azure OpenAI keys).
4. **Run Application**:
   ```bash
   # Backend
   npm start
   # Frontend
   npm run dev
   ```

---

## 🤝 Contributing
We welcome contributions to help protect our planet! Please read our `CONTRIBUTING.md` (coming soon) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License
This project is licensed under the ISC License.

---

<p align="center">
  Built with ❤️ for a Greener Future by Asad Ahmed Saiyed
</p>
