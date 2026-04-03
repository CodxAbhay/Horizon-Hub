# 🌅 Horizon Hub

**Live Demo:** [https://horizon-hub.onrender.com](https://horizon-hub.onrender.com)

Horizon Hub is a **full-stack property listing and booking web application** that allows users to discover, list, review, and book unique stays — from beachside villas to mountain retreats. Built with the **Node.js / Express / MongoDB** stack and styled with **Bootstrap 5 + EJS**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏡 **Property Listings** | Add, view, edit, and delete property listings with image upload |
| 🔐 **Authentication** | Secure signup / login with Passport.js (session-based) |
| 📷 **Image Uploads** | Upload property images via Cloudinary CDN with auto-optimization |
| 🔍 **Search** | Search listings by title, location, or country |
| 🏷️ **Category Filters** | Filter listings by category — House, Mountain, Beach, Castle, etc. |
| ⭐ **Reviews & Ratings** | Leave star ratings and comments; average rating shown on cards |
| 📅 **Booking System** | Book any property with check-in, checkout, and guest details |
| 🛡️ **Security** | Helmet, Rate Limiting, CSRF-safe sessions, secure cookies in production |
| 📱 **Responsive UI** | Works seamlessly on mobile, tablet, and desktop |
| ✅ **Input Validation** | Client-side + server-side (Joi) validation with friendly error messages |

---

## ⚙️ Tech Stack

**Frontend:**
- EJS Templating Engine + EJS-Mate layouts
- Bootstrap 5.3
- Font Awesome 6 icons
- Google Fonts (Inter)

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- Passport.js (Local Strategy authentication)
- Cloudinary (Image storage + optimization)
- Multer (File upload handling)

**Security:**
- Helmet (HTTP security headers)
- express-rate-limit (Brute force protection)
- connect-mongo (Session persistence in MongoDB)
- bcrypt (via passport-local-mongoose)

**DevOps:**
- Render (Deployment)
- MongoDB Atlas (Database)
- GitHub (Version Control)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/CodxAbhay/Horizon-Hub.git
cd Horizon-Hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/horizon-hub?retryWrites=true&w=majority
SESSION_SECRET=your_long_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=8080
```

### 4. Configure MongoDB Atlas

> **Important:** In your MongoDB Atlas dashboard → Network Access → Add your current IP address (or `0.0.0.0/0` for development).

### 5. Run the Application

```bash
npm start
```

Visit 👉 `http://localhost:8080`

---

## 📂 Project Structure

```
Horizon-Hub/
├── controllers/        # Route handler logic
│   ├── listing.js      #   Listing CRUD operations
│   ├── reviews.js      #   Review post/delete
│   └── users.js        #   Auth (signup, login, logout)
├── models/             # Mongoose schemas
│   ├── listing.js      #   Listing model (with category, image, owner)
│   ├── review.js       #   Review model (rating, comment, author)
│   └── user.js         #   User model (email, passport plugin)
├── routes/             # Express routers
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/              # EJS templates
│   ├── layouts/        #   boilerplate.ejs
│   ├── includes/       #   navbar, footer, flash
│   ├── listings/       #   index, show, new, edit, search, bookNow
│   └── users/          #   login, signup
├── public/             # Static files
│   ├── css/style.css
│   └── js/script.js
├── utils/              # Utility helpers
│   ├── ExpressError.js #   Custom error class
│   └── wrapAsync.js    #   Async error wrapper
├── middleware.js        # Auth guards + validation middleware
├── schema.js           # Joi validation schemas
├── cloudConfig.js      # Cloudinary config + Multer storage
└── app.js              # Express app entry point
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|---|---|---|
| GET | `/listings` | All listings (optional `?category=`) | ❌ |
| POST | `/listings` | Create new listing | ✅ |
| GET | `/listings/new` | Render create form | ✅ |
| GET | `/listings/:id` | View listing detail | ❌ |
| PUT | `/listings/:id` | Update listing | ✅ Owner |
| DELETE | `/listings/:id` | Delete listing | ✅ Owner |
| GET | `/listings/:id/edit` | Render edit form | ✅ Owner |
| POST | `/listings/:id/reviews` | Post a review | ✅ |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | ✅ Author |
| GET | `/signup` | Render signup form | ❌ |
| POST | `/signup` | Register user | ❌ |
| GET | `/login` | Render login form | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/logout` | Logout user | ✅ |
| GET | `/search?query=` | Search listings | ❌ |
| GET | `/bookings/:id` | Book Now page | ✅ |
| POST | `/listings/:id/book` | Confirm booking | ✅ |

---

## 🌐 Deploying to Render

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node app.js`
5. Add all environment variables in the Render dashboard:
   - `MONGO_URI`
   - `SESSION_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV` = `production`
6. In MongoDB Atlas → Network Access → Allow `0.0.0.0/0` (all IPs, required for Render)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Abhay Pratap Verma**
- GitHub: [@CodxAbhay](https://github.com/CodxAbhay)
- LinkedIn: [abhay07v](https://www.linkedin.com/in/abhay07v/)
- Instagram: [@abhayverma.07](https://www.instagram.com/abhayverma.07/)

---

⭐ If you find this project helpful, please give it a star on GitHub!
