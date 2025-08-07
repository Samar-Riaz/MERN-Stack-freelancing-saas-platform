# 🚀 Freelancia – Private SaaS Freelancing Platform

A secure, full-featured freelancing marketplace platform tailored for private communities, enabling admins to post jobs and freelancers/interns to bid, collaborate, and deliver projects seamlessly.

---

## 🧩 Features Overview

### 👤 User Roles
- **Admin / Job Poster**
  - Create and manage job listings (title, budget, deadline, category)
  - Review and assign bids
  - Manage tasks/milestones
  - Communicate via chat
  - Approve work, rate freelancers
  - Generate job completion certificates (PDF/email)

- **Freelancer / Intern**
  - Create profile with skills & bio
  - Browse available jobs
  - Submit custom bids
  - View assigned tasks & milestones
  - Upload completed work
  - Receive feedback, ratings & certificates

---

## ⚙️ Core Modules

| Module               | Description |
|----------------------|-------------|
| 🔐 **Authentication** | Secure login system with role-based access control |
| 📋 **Job Management** | Admin creates, edits, and assigns job listings |
| 💰 **Bidding System** | Freelancers submit proposals with timeline and budget |
| 💬 **Messaging System** | One-to-one real-time chat with file sharing |
| ✅ **Task Tracking** | Task status updates and milestone approvals |
| ⭐ **Feedback System** | Mutual rating after project completion |
| 📄 **Certificate Generator** | Optional PDF certificate issued to freelancers |

---

## 🗃️ Database Schema (Main Tables)

- **Users**: `id`, `name`, `email`, `role`, `skills`, `bio`, `rating`
- **Jobs**: `id`, `title`, `description`, `budget`, `deadline`, `status`, `poster_id`
- **Bids**: `id`, `job_id`, `user_id`, `bid_amount`, `message`, `timeline`, `status`
- **Tasks**: `id`, `job_id`, `title`, `status`, `assigned_user_id`
- **Messages**: `id`, `job_id`, `from_user_id`, `to_user_id`, `content`, `file_url`
- **Ratings**: `id`, `job_id`, `rated_by_user_id`, `rated_user_id`, `rating`, `comment`
- **Certificates** *(Optional)*: `id`, `job_id`, `user_id`, `pdf_url`, `issued_date`

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Role-Based Access
- **File Handling**: Multer / Cloud Upload (optional)
- **PDF Generation**: jsPDF or similar libraries
- **Dev Tools**: Postman, Git, VS Code

---

## 📦 Folder Structure

```
/client           # React frontend
/server           # Express backend
 └── /controllers
 └── /models
 └── /routes
 └── /middleware
 └── /utils
```

---

## ▶️ Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/your-username/freelancia-platform.git
cd freelancia-platform
```

2. **Backend Setup**
```bash
cd server
npm install
npm run dev
```

3. **Frontend Setup**
```bash
cd client
npm install
npm start
```

4. Visit `http://localhost:3000` to run the app.

---

## 🧪 Future Enhancements

- Email notifications
- Job categorization filters
- Admin dashboard analytics
- Auto-generated invoices
- Deployment on Vercel/Render

---

## 📃 License

This project is open for learning and portfolio purposes. All rights reserved © Samar Noor Riaz.