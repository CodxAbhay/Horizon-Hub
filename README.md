# 🌅 Horizon Hub

**Live Demo:** [https://horizon-hub.onrender.com](https://horizon-hub.onrender.com)

Horizon Hub is a **full-stack property listing web application** that allows users to list, explore, and manage properties like houses, hotels, and rentals. Built with the **MERN (MongoDB, Express, Node.js)** stack and styled with **Bootstrap + EJS** for a clean and responsive UI.

---

## ✨ Features

* 🏡 **Property Management** – Add, view, edit, and delete property listings
* 🔐 **Authentication** – Secure login & signup with Passport.js
* 📷 **Image Uploads** – Upload property images via Cloudinary
* 📍 **Location Mapping** – Integration for better visualization
* 🧾 **RESTful API** – Clean and scalable backend structure
* 📱 **Responsive UI** – Works seamlessly on mobile, tablet, and desktop

---

## ⚙️ Tech Stack

**Frontend:**

* EJS Templating Engine
* Bootstrap 5

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose ODM)
* Passport.js (Authentication)
* Cloudinary (Image Hosting)

**DevOps & Tools:**

* Render (Deployment)
* GitHub (Version Control)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/CodxAbhay/Horizon-Hub.git
cd Horizon-Hub
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4️⃣ Run the Application

```bash
npm start
```

Visit 👉 `http://localhost:5000`

---

## 📸 Screenshots

> ## ![image](https://github.com/user-attachments/assets/f2f639d8-2839-463b-8325-5c91396937cc)
>
> ## ![image](https://github.com/user-attachments/assets/832d7ad4-f66a-4853-9bef-696dd87d982e)

## ![image](https://github.com/user-attachments/assets/e8cf1b9f-9384-45f3-9266-0cf5ded2916c)

![image](https://github.com/user-attachments/assets/e6d49562-093b-4016-8af3-cd06c5ccfc04)

---

## 📂 Project Structure

```
Horizon-Hub/
│-- config/         # Passport & DB configurations
│-- models/         # Mongoose schemas
│-- routes/         # Express routes
│-- views/          # EJS templates
│-- public/         # Static files (CSS, JS, Images)
│-- app.js          # Main app entry point
│-- package.json
```

---

## 🧑‍💻 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-xyz`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-xyz`)
5. Open a Pull Request

---

## 🔮 Future Enhancements

* 🌍 Integration with Google Maps API
* ⭐ Property ratings & reviews
* 🛒 Booking system for rentals & hotels
* 📊 Admin dashboard with analytics
* 🤖 AI/ML-based **Price Prediction** for properties (upcoming 🚀)

---


## 💡 Acknowledgements

* [Bootstrap](https://getbootstrap.com/)
* [EJS](https://ejs.co/)
* [Passport.js](http://www.passportjs.org/)
* [Cloudinary](https://cloudinary.com/)
* [Render](https://render.com/)

---

## 📡 API Endpoints

| Method | Endpoint         | Description              | Auth Required |
|--------|------------------|--------------------------|---------------|
| GET    | /properties      | Get all properties       | ❌ No         |
| POST   | /properties      | Add new property         | ✅ Yes        |
| GET    | /properties/:id  | Get single property      | ❌ No         |
| PUT    | /properties/:id  | Update property details  | ✅ Yes        |
| DELETE | /properties/:id  | Delete property          | ✅ Yes        |
| POST   | /auth/register   | User registration        | ❌ No         |
| POST   | /auth/login      | User login               | ❌ No         |
| GET    | /auth/logout     | Logout                   | ✅ Yes        |

---

👉 If you like this project, don’t forget to ⭐ the repo on GitHub!

---
