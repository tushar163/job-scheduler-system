# 🚀 Job Scheduler Backend

A lightweight **job scheduling & webhook notification service** built using **Node.js**, **Express**, **Prisma ORM**, and **MySQL**.

This backend provides:

- Job creation & management  
- Background job execution  
- Automatic webhook triggering  
- Webhook logging  
- Paginated job listing  
- Search & filtering  

---

## 📁 Project Structure
```JOB-SCHEDULER-BACKEND/
│── node_modules/
│── prisma/
│   └── schema.prisma
│── src/
│   ├── config/
│   │   └── prismaClient.js
│   ├── controller/
│   │   └── JobController.js
│   ├── routes/
│   │   └── JobRoute.js
│── .env
│── index.js
│── package.json
│── package-lock.json
```

---

## 🛠 Tech Stack

| Layer        | Technology |
|-------------|------------|
| Backend     | Node.js, Express.js |
| ORM         | Prisma |
| Database    | MySQL |
| HTTP Client | Axios |
| Environment | Dotenv |

---

## ⚙️ Setup Instructions

### **1️⃣ Clone the repository**
```bash
git clone <repo-url>
cd JOB-SCHEDULER-BACKEND
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Create .env file
```bash
DATABASE_URL="mysql://root:root@localhost:3306/job_scheduler"
WEBHOOK_URL="https://webhook.site/11ccff14-e3c5-4088-8b38-a4120cb12fee"
```
### 4️⃣ Run Prisma migrations
```bash
npx prisma db push
npx prisma generate
```
### 5️⃣ Start the server
```bash
npm start
```

# 📦 Prisma Schema (Job Scheduler)

## 🧱 Models

### **Job Model**
```prisma
model Job {
  id          String       @id @default(cuid())
  taskName    String
  payload     Json
  priority    Priority
  status      Status       @default(PENDING)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  webhookLogs WebhookLog[]

  @@map("jobs")
}
model WebhookLog {
  id             Int      @id @default(autoincrement())
  jobId          String
  requestBody    Json?
  responseStatus Int?
  responseBody   Json?
  sentAt         DateTime @default(now())

  job Job @relation(fields: [jobId], references: [id])
}
enum Priority {
  HIGH
  MEDIUM
  LOW
}
enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
```
# Job Scheduler – Architecture Overview

This document provides a clear breakdown of the Job Scheduling System architecture, including API structure, controller responsibilities, Prisma integration, webhook handling, and background execution flow.

---

## 🚀 System Architecture (Bullet-Point Summary)

### **1. API Layer (Express.js)**
Handles all incoming HTTP requests:

- `POST /create-job` — Create a new job  
- `POST /run-job/:jobId` — Start job execution  
- `GET /get-jobs` — List jobs with pagination + search  
- `DELETE /delete-job/:jobId` — Remove a job  
- `GET /get-logs/:jobId` — Fetch webhook logs for a job  

---

### **2. Controller Layer (JobController.js)**

Responsible for:

- Job **CRUD operations**
- Job **search + pagination**
- Job **execution**
- Updating job **status: PENDING → IN_PROGRESS → COMPLETED/FAILED**
- Handling **webhook triggers**
- Storing **webhook response logs**

---

### **3. Prisma ORM Layer**

- Type-safe database queries  
- Manages tables:  
  - `Job`  
  - `WebhookLog`  
- Auto-migration support  
- Clean data modelling with relational integrity  

---

### **4. Background Job Execution**

Simulated using `setTimeout()`:

- Mark job as **IN_PROGRESS**
- After X seconds:
  - Mark job **COMPLETED**
  - Trigger webhook
  - Store webhook logs (success or failure)

---

### **5. Webhook Communication**

After a job completes:

- Sends `POST` request to the configured `WEBHOOK_URL`
- Includes job payload in the request body
- Logs:
  - Success response
  - Failure response
  - Retry attempts (if implemented)

---

## 📌 Code Snippets

### **Express Route Setup**
```js
const express = require("express");
const JobController = require("../controller/JobController");

const router = express.Router();

router.post("/create-job", JobController.createJob);
router.post("/run-job/:jobId", JobController.runJob);
router.get("/get-jobs", JobController.getJobs);
router.delete("/delete-job/:jobId", JobController.deleteJob);
router.get("/get-logs", JobController.getLogs);

module.exports = router;
```
# 📡 API Documentation (Bullet-Point Format)

---

## **1. Create Job**
### **POST /create-job**

#### **Body**
```json
{
  "taskName": "Send Email",
  "payload": { "email": "example@test.com" },
  "priority": "HIGH"
}

Creates a new job
Sets initial status → PENDING
```
## **2. Get Jobs**
### **GET /get-jobs?limit=10&page=1&search=email&status=PENDING**
```Supports

Pagination (limit, page)

Search (taskName or payload)

Status filtering (PENDING / IN_PROGRESS / COMPLETED)
```
## 3. Run Job

### **POST /run-job/:jobId**

#### **Triggers**
- Marks job as **IN_PROGRESS**
- Starts background execution
- Calls webhook after job completion

#### **Example Response**
```json
{
  "success": true,
  "message": "Job started",
  "status": "IN_PROGRESS"
}
```
---


## 4. Delete Job

### **DELETE /delete-job?id=<jobId>**

#### **Behavior**
- Deletes job by ID
- Also deletes associated webhook logs
## 5. Get Logs

### **GET /get-logs**

#### **Returns**
- All stored webhook logs
- Includes response, status, and timestamps
## 🔔 Webhook Lifecycle (Bullet Points)

### **1️⃣ Job Starts**
- API marks job status → **IN_PROGRESS**
- Response is returned immediately

### **2️⃣ Background Execution**
- A **3-second delay** simulates heavy/background work
- Job continues running asynchronously

### **3️⃣ Job Completes**
- Job status updated → **COMPLETED**
- Completion timestamp is recorded

### **4️⃣ Webhook Sent**
- System sends a **POST** request to `WEBHOOK_URL`
- Sends job details and completion information to the webhook endpoint

```json
{
  "jobId": "xyz123",
  "taskName": "Send Email",
  "priority": "HIGH",
  "payload": { "email": "test@test.com" },
  "completedAt": "2025-11-25T09:32:00Z"
}
```
### **5️⃣ Webhook Logged**

- Stored in WebhookLog table:

- Sent requestBody

- responseStatus (200, 500 etc.)

- responseBody (success/failure)

- sentAt timestamp

## 📁 Folder Structure (Next.js Frontend)
```
job-schedular-frontend/
│── public/
│── src/
│   ├── app/
│   │   ├── (modules)/
│   │   │   └── dashboard/
│   │   │       ├── JobsForm.jsx
│   │   │       ├── page.jsx
│   │   │       └── layout.jsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── hero.jsx
│   │   ├── layout.js
│   │   ├── page.jsx
│   │   └── providers.jsx
│   │
│   ├── components/
│   │   ├── ConfirmationModal/
│   │   │   └── ConfirmationModal.jsx
│   │   ├── CustomTable/
│   │   │   ├── CustomTable.jsx
│   │   │   ├── TablePagination.jsx
│   │   │   ├── TableRenderCell.jsx
│   │   │   └── TableTopContent.jsx
│   │   ├── FormModal/
│   │   │   └── FormModal.jsx
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   └── SideBar/
│   │       └── SideBar.jsx
│   │
│   ├── hooks/
│   │   └── useTableControls.jsx
│   │
│   ├── service/
│   │   └── CommanService.js
│
│── .env
│── .gitignore
│── eslint.config.mjs
│── jsconfig.json
│── next.config.mjs
│── package.json
│── package-lock.json
│── postcss.config.mjs
│── README.md
```
## **🧪 Tech Stack**
- **Next.js 16**
- **React 19**
- **Tailwind CSS v4**
- **HeroUI (UI components)**
- **Framer Motion** (animations)
- **Lucide Icons**
- **React Icons**

## **⚙️ Setup Instructions**
1. Clone the repository:

   git clone <repo-url>
   cd job-schedular-frontend

2. Install dependencies:

   npm install

3. Create .env file:

   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

4. Run development server:

   npm run dev

5. Build for production:

   npm run build

6. Start production server:

   npm start

## **🏗️ Architecture Overview**
### 1. **App Router Architecture (Next.js 16)**
- Uses `/app` directory
- Server + Client components mixed
- Global providers located in `providers.jsx`
- Module-based routing under `/app/(modules)`

### 2. **Modules Layer**
Located inside:
src/app/(modules)/dashboard/
Contains:
- `JobsForm.jsx` → Form for creating/updating jobs  
- `page.jsx` → Dashboard main UI  
- `layout.jsx` → Layout wrapper for dashboard  

### 3. **Components Layer**
Reusable UI components grouped by domain:
```
components/
├── ConfirmationModal/
├── CustomTable/
├── FormModal/
├── Header/
└── SideBar/
```

### 4. **Hooks Layer**
Handles:
- Pagination state  
- Search state  
- Table filters  

### 5. **Service Layer**

## 📡 Service Layer — CommanService.js

This file provides reusable wrapper functions for making API calls using the `fetch` API.  
It uses the base URL from environment variables:

```js
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
🔹 1. GETService

Performs a GET request to the given endpoint.

export const GETService = async ({ endpoint }) => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

🔹 2. POSTService

Used for POST requests with JSON body.
Includes error handling when the server returns a non-200 response.

export const POSTService = async ({ endpoint, data }) => {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "API Request Failed");
        }

        return await response.json();

    } catch (error) {
        console.error("POSTService Error:", error.message);
        throw error;
    }
};

🔹 3. PUTService

Used for updating resources using PUT requests.

export const PUTService = async ({ endpoint, data }) => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

🔹 4. DELETEService

Sends a DELETE request to delete resources based on endpoint path.

export const DELETEService = async ({ endpoint }) => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

```

---

## 🎨 UI Components Breakdown

```md
CustomTable→ Table, pagination, row rendering
FormModal→ Used for job creation/edit
ConfirmationModal → Delete confirmation dialog
Header→ Top navigation bar
SideBar→ Left menu navigation
```




