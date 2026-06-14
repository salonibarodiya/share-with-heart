# Share With Heart — Donation & Reuse Platform

Share With Heart is a full-stack social impact web application designed to streamline the lifecycle of donating unused clothes and household items. The platform bridges the gap between conscious donors and verified non-governmental organizations (NGOs), enabling efficient logistics scheduling, transactional tracking, and waste reduction.

Developed as a core deliverable for the **Unified Mentor Internship Program**.

---

## 🚀 Live Production Link
Click the link below to access the deployed application:
👉 **[Live Project Demo](https://share-with-heart-ni76idvk2-saloni-barodiya-s-projects.vercel.app)**

---

## 📌 Project Overview & Context
In urban environments, massive quantities of usable clothes and household goods are discarded into landfills due to fragmented donation channels, coordination challenges, and a lack of transparency. 

This platform addresses these core issues by providing a centralized gateway that digitizes traditional manual logging. It ensures that unused resources are effectively redirected to verified orphanages and NGOs, promoting sustainability, social welfare, and environmental responsibility.

### Key Objectives Achieved:
* **Centralized NGO Directory:** Onboards pre-verified local NGO entities categorized by community impact.
* **Logistics Automation:** Enables users to schedule on-demand doorstep collections with designated time slots.
* **Transparency & Lifecycle Tracking:** Replaces manual ledgers with a real-time status management pipeline.
* **Responsive Usability:** Offers a cross-platform, mobile-friendly interface designed for accessible navigation across all user age demographics.

---

## 🛠️ Architecture & Technology Stack

### 1. Frontend Tier
* **Framework:** React.js (Component-driven view architecture)
* **Styling Engine:** Tailwind CSS (Responsive utility-first layouts for seamless mobile and desktop viewport switching)

### 2. Backend Application Layer
* **Runtime Environment:** Node.js
* **Framework:** Express.js (RESTful API routing engine for handling secure transaction payloads)

### 3. Persistence Layer (Database)
* **Database:** MongoDB Atlas (Cloud-hosted NoSQL cluster)
* **ODM Layer:** Mongoose (Enforces structural data integrity and payload validation rules)

---

## 📊 Core Data & API Implementation

The system is engineered around a modular monorepo architecture mapping directly to the data fields required for operational reporting:

* **Mongoose Schema Model:** Tracks critical entities including `itemType` (category logging), `quantity` (impact metrics analysis), `pickupAddress`, `scheduledTime`, and `status` workflows.
* **REST API Endpoints:** 
  * `GET /api/ngos` — Fetches the verified organizational registry.
  * `POST /api/donations` — Registers dynamic doorstep pickup schedules.
  * `GET /api/donations` — Compiles a historical ledger for administrative tracking.
  * `PUT /api/donations/:id` — Facilitates state updates as collection workflows progress.
