# SB-MED01 Biomarker Analyzer Dashboard

![Version](https://img.shields.io/badge/version-1.0.0-emerald)
![Status](https://img.shields.io/badge/status-active-blue)
![Tech](https://img.shields.io/badge/react-18-61DAFB)

A professional medical frontend dashboard designed for the **SB-MED01** biomarker analyzer. This application provides real-time visualization of critical health metrics, trend analysis, and automated alerting for medical professionals.

## 🏥 Project Overview

The SB-MED01 Dashboard is a grid-based, responsive UI built to monitor multi-organ biomarkers non-invasively. It bridges the gap between raw sensor data and actionable clinical insights using a clean "Medical Professional" aesthetic.

### Key Features

*   **Real-Time Monitoring**: Live tracking of **Troponin** (Cardiac), **Glucose** (Serum), **Creatinine** (Renal), **HbA1c**, and **ALT**.
*   **Dynamic Trend Analysis**: Interactive 24-hour line charts visualizing fluctuations in biomarker levels.
*   **Intelligent Alerting**: Automatic classification of readings into `Normal`, `Elevated`, or `Critical` statuses with visual alarms.
*   **Environmental Context**: Integrated header with real-time time and weather data (via Open-Meteo API) to track patient environment conditions.
*   **History & Reporting**: searchable patient history logs and exportable JSON/CSV reports.

## 🛠 Tech Stack

*   **Frontend Framework**: React 18
*   **Styling**: Tailwind CSS (Slate/Emerald/Rose medical palette)
*   **Icons**: Lucide React
*   **Visualization**: Recharts (Responsive Line Charts)
*   **External APIs**: Open-Meteo (Weather data)

## 📂 Project Structure

```bash
├── components/          # UI Components
│   ├── Dashboard.tsx    # Main grid layout with StatCards and Charts
│   ├── StatCard.tsx     # Individual metric display
│   ├── BiomarkerChart.tsx # Recharts implementation
│   └── SystemStatusHeader.tsx # Top bar with clock & weather
├── services/
│   └── dataService.ts   # Mock data generation and threshold logic
├── scripts/
│   └── process_biomarkers.py # Python utility for backend data processing
└── types.ts             # TypeScript interfaces
```

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm start
    ```

## 📊 Biomarker Thresholds

The application uses standard clinical ranges for status classification:

| Biomarker | Unit | Warning Threshold | Critical Threshold |
|-----------|------|-------------------|--------------------|
| Troponin  | ng/mL| ≥ 0.05            | ≥ 0.40             |
| Glucose   | mg/dL| ≥ 141             | ≥ 200              |
| Creatinine| mg/dL| ≥ 1.4             | ≥ 2.0              |
| HbA1c     | %    | ≥ 5.7             | ≥ 6.5              |
| ALT       | U/L  | ≥ 56              | ≥ 101              |

## 🐍 Backend Scripts

A Python script is included in `scripts/process_biomarkers.py` to demonstrate how raw sensor CSV data can be processed, cleaned, and classified before being sent to the frontend.

```bash
python scripts/process_biomarkers.py
```

---

© 2026 SB-MED01 Team. Designed for medical excellence.
