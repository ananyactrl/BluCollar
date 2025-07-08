# 🔧 BluCollar Hub

**BluCollar Hub** is a full-stack web platform that connects users with skilled blue-collar workers — like electricians, plumbers, and maids — for on-demand, verified home services.

This platform enables:
- Worker registration & authentication
- Job posting and real-time profession-based matching
- Worker dashboards, job status updates, and reviews
- Map-based service areas with animated UI elements

---

## 🚀 Live Demo

🔗 [https://blucollar.vercel.app](https://blucollar.vercel.app)

---

## 🛠️ Tech Stack

### ⚛️ Frontend

- **React** (v19.x)
- **Vite** (v6.x)
- **React Router DOM** (v7.x)
- **Axios** – API communication
- **Framer Motion**, **AOS**, **GSAP** – Smooth animations
- **Bootstrap** (v5.x) – Responsive components
- **React Toastify** – Notifications
- **React Modal**, **React Calendar** – Modals & Calendar UI
- **Socket.io-client** – Real-time status updates
- **Three.js**, **React Three Fiber**, **Drei** – 3D graphics
- **Dayjs** – Date utilities
- **jwt-decode** – JWT token parsing
- **Google Maps API** – Location features

### 🎨 UI/UX Highlights

- Custom CSS for layouts and animations
- Capsule buttons, scroll effects, responsive UI
- Mobile-first, clean and professional UI
- Consistent design system across all pages

---

### 🔙 Backend

- **Node.js** (v18+)
- **Express.js** (v4.x)
- **Firebase Admin SDK**
  - Firestore DB (job data, users, worker profiles)
  - Firebase Auth (authentication for users/workers)
- **JWT** – Token generation & verification
- **Bcrypt** – Password hashing
- **Socket.io** – Real-time job acceptance/updates
- **Multer** – Profile image uploads
- **Nodemailer** – Email notifications
- **CORS**, **Dotenv**

---

### 🧪 Dev Tools

- **Vite** – Frontend dev server & build
- **Nodemon** – Backend hot reload
- **ESLint**, **PostCSS**

---

## 📂 Project Structure

```
/signup1/frontend    → React + Vite 
/signup1/backend     → Node.js + Express + Firebase API
```

---

## 📦 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/blu0617/BluCollar.git
cd servlyn1
```

### 2. Setup Backend
```bash
cd signup1/backend
npm install
node server.js
```
- Configure your Firebase credentials in `backend/firebase.js` and `backend/serviceAccountKey.json` as needed.

### 3. Setup Frontend
```bash
cd signup1/frontend
npm install
npm run dev
```

---

## 🌐 Deployment
- **Frontend:** Vercel (https://blucollar.vercel.app/)
- **Backend:** (e.g. Render,Firebase, or your own server)

---

## 📸 Screenshots
> _(Add screenshots in a `/screenshots` folder and display them here)_
### Homepage
![Homepage](screenshots/homepage.png)
---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is licensed under the MIT License.

---

## ✨ Author & Contact
**Ananya Singh** ([LinkedIn](https://www.linkedin.com/in/ananya-singh-60a730372/))  
MIT Academy of Engineering, 2025

For questions, contact via LinkedIn or open an issue on GitHub.

