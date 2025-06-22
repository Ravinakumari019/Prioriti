> 🚧 This project is currently under active development.
> Some features may not yet be fully implemented.


# 🧠 Prioriti - Task Management App

A full-stack task management platform with role-based access.  
Built using **MongoDB**, **Express**, **React (Vite)**, and **Node.js**, the app helps admins assign and monitor tasks, and allows members to view and manage their assigned tasks.

---

## 👥 User Roles

### 🔑 Admin Panel
- Admins register using a **private invite token**
- Can invite members into their workspace
- Can **assign tasks**, set **priority**, and **track progress**
- Can **view task stats** (pending, in-progress, completed)
- Can **export tasks to Excel**

### 👤 Member Panel
- Members join only via **admin invite**
- Can view and update only **their assigned tasks**
- Limited to their own dashboard

---

## 📁 Folder Structure
Prioriti/
├── backend/ # Express.js REST API
├── frontend/ # React + Vite client


---

## 🚀 Features

- 🔐 JWT-based authentication
- 🛡 Role-based access (admin & member)
- ✉️ Admin-invite system for members
- ✅ Task creation with title, description, priority, status, due date
- 📁 File uploads (documents, images) via Multer
- 📊 Task report export (Excel) via ExcelJS
- 📦 MongoDB integration using Mongoose
- 🌐 Cross-origin support for frontend-backend communication

---

## 🔧 Tech Stack

### 🛠 Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer
- bcryptjs
- dotenv
- ExcelJS
- JSON Web Tokens (JWT)

### 🎨 Frontend:
- React 18 + Vite
- Tailwind CSS
- Shadcn/UI (Radix UI)
- React Hook Form + Zod
- React Query
- Lucide React Icons

---

## 🧪 Setup Instructions

### ⚙️ Prerequisites
- Node.js & npm
- MongoDB URI (e.g., MongoDB Atlas)

---

### 🔙 Backend Setup

```bash
cd backend
npm install

Create .env in backend/:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_TOKEN=your_admin_invite_token
CLIENT_URL=http://localhost:5173

Then run:
npm run dev

cd frontend
npm install
npm run dev
