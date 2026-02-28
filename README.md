# 🌳 TreeTrace: Satellite-Driven Forest Monitoring

[![Production Ready](https://img.shields.io/badge/status-production--ready-success.svg)](#)
[![Kubernetes](https://img.shields.io/badge/deployed-AKS-blue.svg)](#)
[![Monitoring](https://img.shields.io/badge/monitoring-Prometheus%20%26%20Grafana-orange.svg)](#)

**TreeTrace** is a powerful tool built to protect forests. It uses satellite data, AI, and modern cloud technology to track tree loss and help with replanting.

---

## 📂 Project Structure

```text
TreeTrace/
├── backend/                # API and Data Processing
│   ├── aiServices/        # AI logic (Azure OpenAI)
│   ├── controllers/       # Route handlers
│   ├── models/            # Database schemas
│   ├── k8s-specifications/ # Kubernetes (AKS) configs
│   └── utils/             # Helper functions
├── frontend/               # User Interface (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI parts
│   │   ├── pages/         # Main screens
│   │   └── services/      # API calls
└── README.md              # Main documentation
```

---

## 🎯 The Problem

1.  **Hidden Damage**: Forest loss often happens in remote areas where nobody is watching.
2.  **Too Much Data**: Satellite images are hard for regular people to understand.
3.  **Slow Response**: By the time people notice a problem, it's often too late to stop it.

## ✅ The Solution

TreeTrace solves these problems by:
-   **Watching from Space**: Using **Google Earth Engine (GEE)** to check forest health automatically.
-   **Simple AI Reports**: Using **AI (GPT-4o)** to turn complex data into easy-to-read summaries.
-   **Connecting People**: Sending alerts directly to the nearest NGOs for quick action.

---

## 🛠️ Technology Stack

-   **Frontend**: React (Vite) with Tailwind CSS for a smooth and fast user experience.
-   **Backend**: Node.js and Express for handling data and user requests.
-   **Database**: MongoDB for storing reports and user information.
-   **AI & Logic**: Azure OpenAI for smart analysis and Google Earth Engine for satellite maps.
-   **Media**: Cloudinary for storing photos and Resend for sending emails.

---

## ☁️ Deployment & Monitoring (AKS)

TreeTrace is built to be reliable and always online.

### Docker & Kubernetes (AKS)
-   **Containerized**: The app is packed into **Docker** containers so it runs the same way everywhere.
-   **Orchestrated**: We use **Azure Kubernetes Service (AKS)** to manage the app. This means it can handle a lot of users and automatically restarts if something goes wrong.
-   **Zero Downtime**: When we update the code, the system swaps to the new version without stopping the app.

### Monitoring with Prometheus & Grafana
-   **Prometheus**: Constantly checks the health and speed of the backend.
-   **Grafana**: Provides a visual dashboard to see how many people are using the app and if there are any errors.
-   **Live Alerts**: If anything breaks, the team is notified immediately.

---

## � How to Run Locally

1.  **Clone the project**:
    ```bash
    git clone https://github.com/AsadAhmedSaiyed/TreeTrace.git
    ```
2.  **Install everything**:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3.  **Add Keys**: Fill in your `.env` files with your API keys (Clerk, MongoDB, GEE, Azure).
4.  **Start it up**:
    ```bash
    # Backend
    npm start
    # Frontend (in another terminal)
    npm run dev
    ```

---

<p align="center">
  Built for a better planet by Asad Ahmed Saiyed
</p>
