


# 📌 Task Management System

A full-stack **Task Management System** that allows **admins** and **users** to manage tasks efficiently.
Built with **Nextjs (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)**.

---

## 🚀 Features

### 🔑 Authentication & Authorization

* User **signup & login** with JWT authentication.
* Role-based access (**Admin & User**).

### 👨‍💻 Admin

* Dashboard overview.
* Create, update, and delete tasks.
* Assign tasks to users.
* Manage users.

### 👤 User

* Dashboard overview.
* View assigned tasks.
* Update task progress (checklists).
* View task details.

### 📋 Task Management

* Set **priority levels** (Low, Medium, High).
* Set **due dates**.
* Add **attachments**.
* Add **todo checklists**.

---

## 🛠️ Tech Stack

**Frontend**

* Nextjs (with Context API)
* Tailwind CSS
* Axios
* React Hot Toast (notifications)

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Other Tools**

* JWT Authentication
* Bcrypt (password hashing)
* Moment.js (date handling)

---

## 📂 Project Structure

```
task-manager/
│── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # App pages (Admin, User, Auth)
│   │   ├── context/       # Global context (User, Task)
│   │   ├── utils/         # API config, constants
│   │   └── App.js         # Main app entry
│── server/                # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & error middleware
│   └── server.js          # Backend entry point
│── README.md              # Documentation
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AniSmart-86/task-manager.git
cd task-manager
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm start
```

---

## 🖼️ Screenshots 



---
<img width="1776" height="1020" alt="task-img" src="https://github.com/user-attachments/assets/d139c8f7-c5fb-4b9a-b4aa-af89c880e171" />

## 📌 Future Improvements

* Add project grouping (multiple tasks per project).
* Enable file uploads for attachments (currently links only).
* Add task progress analytics.
* Email notifications on task assignment.

---

## 👨‍💻 Author

**Ani Emmanuel**

* Twitter: [@Anismart13](https://twitter.com/Anismart13)
* GitHub: [anismart-86](https://github.com/anismart-86)
* Frontend Mentor: [AniSmart](https://www.frontendmentor.io/profile/AniSmart)


