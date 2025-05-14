# 💻 School Vaccination Portal - Frontend

This is the frontend of the **School Vaccination Portal** built with **React**. 
It allows school coordinators to manage students, vaccination drives, and view vaccination reports.

---

## 🚀 Tech Stack

- React.js
- Axios (for API communication)
- React Router DOM (for navigation)
- CSS 
- Context API / Local Storage (for auth/session)

---

## 📁 Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/        # Reusable components (sidebar, forms, etc.)
│   ├── pages/             # Pages like Login, Dashboard, Students, Reports
│   ├── styles/            # CSS or Tailwind styles
│   ├── App.js             # App entry point with routes
│   ├── index.js           # Root ReactDOM render
│   └── apiConfig.js 
└── README.md
```

---

## 🧑‍💻 Features

- 🔐 Login as School Coordinator (simple auth)
- 🧒 Add, Edit, Delete students
- 📂 Upload student data via CSV
- 💉 Schedule and view vaccination drives
- 📊 View vaccination reports
- 📌 Dashboard showing key metrics

---

## 🔧 Getting Started (Local Setup)

### 1. Clone the frontend branch

```bash
git clone -b frontend https://github.com/your-username/school-vaccination-portal.git
cd school-vaccination-portal
```

### 2. Install dependencies

```bash
npm install react react-dom react-router-dom axios
```

### 3. Configure API Base URL

In `src/apiConfig.js`:

```js
const API_BASE_URL = 'http://localhost:5000/api';
```

### 4. Run the app

```bash
npm start
```

The frontend will start on:
```
http://localhost:3000
```

---

## 🧪 Pages Summary

| Page                | Description                               |
|---------------------|-------------------------------------------|
| `/login`            | School coordinator login page             |
| `/dashboard`        | Overview of total/vaccinated students     |
| `/students`         | Add/Edit/Delete/Search/Upload students    |
| `/drives`           | Schedule and view vaccination drives      |
| `/reports`          | View/export vaccination reports           |

---

## ⚠️ Prerequisites

- Ensure the **backend** is running on port `5000`
- Test API endpoints using Postman if needed
- Keep `.env` variables consistent
---

## 👨‍🔧 Author

Developed by [Sahil Tamboli]  
