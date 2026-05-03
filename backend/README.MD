# 🏨 Hotel Reservation System – Backend Setup Guide

This repository contains the backend for the Hotel Reservation System.
When set up correctly, your project structure should look like this:

```
project-root/
├── backend/   ← (this repository)
└── frontend/  ← (created separately by frontend team)
```

---

## 🛠️ Step 1: Clone into the Correct Folder Structure

Clone this repo into a folder named `backend` inside your main project directory.

```bash
# Create a root project folder (if you don't already have one)
mkdir hotel-reservation-system
cd hotel-reservation-system

# Clone backend branch into a folder named "backend"
git clone -b backend https://github.com/bestabhinav97/ProjectBooking2.0.git backend

# Enter backend folder
cd backend
```

> ⚠️ This ensures your structure matches the team setup. The `frontend/` folder will be added separately by the frontend team.

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

---

## 🗄️ Step 3: Database Setup

Since the database is not shared remotely, you must recreate it locally using the provided schema.

### 1. Create the Database

Open **MySQL Workbench** and run:

```sql
CREATE DATABASE bookingProject;
```

### 2. Import Tables & Data

1. Go to **Server → Data Import**
2. Select **Import from Self-Contained File**
3. Choose: `backend/db/init.sql`
4. Under **Default Target Schema**, select: `bookingProject`
5. Click **Start Import**

---

## ⚙️ Step 4: Configure Environment Variables

Create a `.env` file in the backend root:

```
backend/.env
```

Add the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_DB=bookingProject
PORT=3000
```

> Replace `your_mysql_password_here` with your actual MySQL password.

---

## 🚀 Step 5: Start the Server

```bash
npm run dev
```

Server will be available at: **http://localhost:3000**

---

## ⚠️ Common Errors & Fixes

### ❌ Empty Folder After Clone

You likely didn't clone the correct branch.

```bash
git checkout backend
```

### ❌ ER_ACCESS_DENIED_ERROR

Your `.env` credentials don't match your MySQL setup. Double-check:

- Username (`root`?)
- Password

### ❌ Table Doesn't Exist (e.g. `bookingProject.users`)

You skipped the database import step. Re-run **Step 3** and ensure:

- Correct schema is selected
- `init.sql` was fully imported
