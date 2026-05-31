<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f766e,50:059669,100:34d399&height=220&section=header&text=RMS%20API&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Registrar%20Management%20System%20%E2%80%94%20Backend&descAlignY=58&descSize=16"/>

<!-- Typing Animation -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=059669&center=true&vCenter=true&multiline=true&width=700&lines=Addis+Ababa+University+%F0%9F%8E%93;Computer+Science+Final+Year+Defense+Project;RESTful+API+for+Academic+Registrar+Operations" alt="Typing SVG" />
</a>

<br/>

<!-- Badges -->
<img src="https://img.shields.io/badge/AAU-Computer%20Science-004B87?style=for-the-badge&logo=google-scholar&logoColor=white"/>
<img src="https://img.shields.io/badge/Status-Defense%20Project-success?style=for-the-badge"/>
<img src="https://img.shields.io/badge/License-Academic-blue?style=for-the-badge"/>

<br/><br/>

<!-- Tech Stack Badges -->
<img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-Auth-F59E0B?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
<img src="https://img.shields.io/badge/Mongoose-8-880000?style=for-the-badge"/>

</div>

---

## 📖 About the Project

**Registral (RMS)** is a full-stack **Registrar Management System** developed as a **Final Year Defense Project** at:

> **Addis Ababa University**  
> College of Natural & Computational Sciences  
> Department of Computer Science

This repository contains the **backend REST API** — a secure, role-based server that powers student management, grade workflows, document processing, announcements, and analytics for academic registrar operations.

### ⚙️ API Capabilities

| Module | Endpoints | Description |
|--------|-----------|-------------|
| 🔐 **Auth** | `/api/auth/*` | Register, login, JWT token issuance |
| 👥 **Users** | `/api/users/*` | User CRUD (admin/registrar) |
| 👨‍🎓 **Students** | `/api/students/*` | Student records & enrollment |
| 📚 **Courses** | `/api/courses/*` | Course catalog management |
| 📝 **Grades** | `/api/grades/*` | Submit, approve, reject grades |
| 📄 **Documents** | `/api/documents/*` | Document request lifecycle |
| 📢 **Announcements** | `/api/announcements/*` | Institutional announcements |
| 📈 **Reports** | `/api/reports/*` | Dashboard stats & analytics |

### 🔒 Role-Based Access Control

```
Student ──► view grades, request documents, read announcements
Instructor ──► submit grades for assigned courses
Registrar ──► approve grades, process documents, manage students
Dept Head ──► course management, department reports
Admin ──► full system access including user management
```

---

## 👥 Project Team

<table align="center">
  <tr>
    <td align="center" width="200">
      <img src="https://avatars.githubusercontent.com/u/583231?s=120&v=4" width="100" style="border-radius:50%"/><br/>
      <b>Elham Namus</b><br/>
      <sub>NSE/2513/14</sub><br/>
      <img src="https://img.shields.io/badge/Role-Developer-059669?style=flat-square"/>
    </td>
    <td align="center" width="200">
      <img src="https://avatars.githubusercontent.com/u/583231?s=120&v=4" width="100" style="border-radius:50%"/><br/>
      <b>Selamawit Shumbet</b><br/>
      <sub>NSE/7812/14</sub><br/>
      <img src="https://img.shields.io/badge/Role-Developer-34d399?style=flat-square"/>
    </td>
    <td align="center" width="200">
      <img src="https://avatars.githubusercontent.com/u/583231?s=120&v=4" width="100" style="border-radius:50%"/><br/>
      <b>Yordanos Zerihun</b><br/>
      <sub>NSE/5836/14</sub><br/>
      <img src="https://img.shields.io/badge/Role-Developer-0f766e?style=flat-square"/>
    </td>
  </tr>
  <tr>
    <td colspan="3" align="center">
      <br/>
      <img src="https://img.shields.io/badge/Advisor-Mr.%20Ashenafi-004B87?style=for-the-badge&logo=google-scholar&logoColor=white"/>
    </td>
  </tr>
</table>

---

## 🔗 Related Repository

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/yordanos1234/rms-frontend">
        <img src="https://img.shields.io/badge/Frontend%20Client-rms--frontend-667eea?style=for-the-badge&logo=react&logoColor=white"/>
      </a>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/UI-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yordanos1234/rms-backend.git
cd rms-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed demo data (optional)
npm run seed

# Start the server
npm start
```

API runs at **`http://localhost:5000`**.

> 💡 No local MongoDB? The server automatically starts an **in-memory MongoDB** for development.

### 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run with nodemon (hot reload) |
| `npm run seed` | Seed demo users, courses & data |

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes (or uses in-memory) |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: `5000`) | No |

---

## 📡 API Endpoints

<details open>
<summary><b>Authentication</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

</details>

<details>
<summary><b>Resources</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List users (admin/registrar) |
| `GET` | `/api/students` | List students |
| `GET/POST` | `/api/courses` | Course catalog |
| `GET/POST` | `/api/grades` | Grade management |
| `GET/POST` | `/api/documents` | Document requests |
| `GET/POST` | `/api/announcements` | Announcements |
| `GET` | `/api/reports/stats` | Dashboard statistics |

</details>

---

## 🎭 Demo Accounts

<table align="center">
  <tr>
    <th>Role</th>
    <th>Email</th>
    <th>Password</th>
  </tr>
  <tr><td>👑 Admin</td><td><code>admin@rms.com</code></td><td><code>password123</code></td></tr>
  <tr><td>📋 Registrar</td><td><code>registrar@rms.com</code></td><td><code>password123</code></td></tr>
  <tr><td>🏛️ Dept Head</td><td><code>depthead@rms.com</code></td><td><code>password123</code></td></tr>
  <tr><td>👨‍🏫 Instructor</td><td><code>instructor@rms.com</code></td><td><code>password123</code></td></tr>
  <tr><td>🎓 Student</td><td><code>elham@rms.com</code></td><td><code>password123</code></td></tr>
</table>

---

## 🏗️ Project Structure

```
backend/
├── config/         # Database configuration
├── controllers/    # Route handlers
├── middleware/     # Auth, validation
├── models/         # Mongoose schemas
├── routes/         # Express route definitions
├── server.js       # App entry point
├── seed.js         # Demo data seeder
└── .env.example    # Environment template
```

---

## ☁️ Deployment

Deploy to **Render**, **Railway**, or similar Node.js hosts:

1. Set `MONGODB_URI` to your [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
2. Set `JWT_SECRET` to a strong random string
3. Set `PORT` if required by the host

---

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js&theme=dark&perline=8"/>

</div>

---

<div align="center">

<!-- Animated Footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f766e,50:059669,100:34d399&height=120&section=footer&text=Built%20with%20%E2%9D%A4%EF%B8%8F%20for%20AAU%20Computer%20Science&fontSize=16&fontColor=fff&animation=twinkling"/>

**Registrar Management System (RMS)** · Final Year Project · 2025/2026

<img src="https://komarev.com/ghpvc/?username=yordanos1234-rms-backend&label=Project%20Views&color=059669&style=flat-square"/>

</div>
