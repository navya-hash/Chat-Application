# VibeChat 💬 — Modern Real-Time Chat Application

VibeChat is a full-stack, real-time messaging web application featuring full-duplex communication with Socket.IO, secure JWT authentication with HTTP-only cookies, MongoDB message persistence, real-time online status tracking, typing indicators, and customizable user profiles.

---

## ✨ Features

- **🔒 Secure Authentication**: Full registration & login flow with password hashing (`bcrypt`), access & refresh token rotation (`JWT`), and HTTP-only cookies.
- **⚡ Real-Time Messaging**: Instant bi-directional messaging powered by **Socket.IO**.
- **🟢 Live Online/Offline Status**: Real-time tracking of online contacts across connected sockets.
- **✍️ Interactive Typing Indicators**: Animated status feedback when contacts are typing a message.
- **💾 Database Persistence**: Conversation history and messages safely stored in **MongoDB**.
- **🎨 Custom SVG Avatars**: Procedural vector avatar generation using `@multiavatar/multiavatar`.
- **⚙️ Profile Management**: Editable user profile settings (Display Name, Job Title, Bio).
- **🔍 Contact Search**: Instant client-side contact filtering and workspace search.
- **🔄 Session & Chat State Persistence**: Persistent chat selection across page refreshes without losing active conversation state.
- **🎨 Modern Glassmorphism UI**: Premium dark mode theme built with Vanilla CSS & Tailwind CSS v4.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **State & Router**: React Router v7, React Hooks
- **HTTP & Sockets**: Axios, Socket.IO Client
- **UI Components**: React Toastify, Emoji Picker React, React Icons

### **Backend**
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-Time**: Socket.IO
- **Security**: JSON Web Tokens (JWT), Bcrypt, Cookie-Parser, CORS, Dotenv

---

## 📁 Project Structure

```text
chatApplication/
├── backend/
│   ├── CONTROLLERS/
│   │   ├── msgController.js      # Message creation & retrieval controllers
│   │   └── userController.js     # Auth, profile, avatar & session controllers
│   ├── MODELS/
│   │   ├── messageModel.js       # MongoDB message schema
│   │   ├── refreshToken.js       # MongoDB refresh token schema
│   │   └── userSchema.js          # MongoDB user schema
│   ├── ROUTES/
│   │   ├── messageRoutes.js      # Message API routes
│   │   └── userRoutes.js        # Auth & user API routes
│   ├── middleware/
│   │   └── auth.js               # JWT cookie verification middleware
│   ├── db.js                     # MongoDB connection configuration
│   ├── index.js                  # Express app & Socket.IO server initialization
│   └── package.json
├── frontend/
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/           # UI Components (ChatContainer, Contacts, ChatInput, Messages, SettingsPane)
│   │   ├── pages/                # Page Views (Chat, Login, Signup, SetAvatar)
│   │   ├── utils/                # API routes configuration, Axios interceptor, SVG helper
│   │   ├── App.jsx               # Router & App layout
│   │   ├── main.jsx              # React DOM root entry
│   │   └── index.css             # Design tokens & global CSS styles
│   ├── vite.config.js
│   └── package.json
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI.

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/navya-hash/Chat-Application.git
   cd Chat-Application
   ```

2. **Configure Backend Environment**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=7800
   MONGO_URL=mongodb://127.0.0.1:27017/mydb
   JWT_SECRET=your_jwt_secret_key_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   NODE_ENV=development
   ```

3. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

---

## 🏃 Running the Application

### 1. Start the Backend Server
```bash
cd backend
node index.js
```
*The backend server will start at `http://localhost:7800` and connect to MongoDB.*

### 2. Start the Frontend Application
```bash
cd frontend
npm run dev
```
*The Vite dev server will start at `http://localhost:5173`.*

---

## 🔌 API & Socket Reference

### **REST API Endpoints**

| Endpoint | Method | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `/auth/api/signup` | `POST` | Public | Register new user account |
| `/auth/api/login` | `POST` | Public | Authenticate user & set JWT HTTP-only cookies |
| `/auth/api/verify` | `GET` | `auth` | Verify current session and retrieve profile |
| `/auth/api/setAvatar` | `POST` | `auth` | Save selected SVG avatar |
| `/auth/api/allUsers` | `GET` | `auth` | Retrieve contacts list excluding current user |
| `/auth/api/updateProfile` | `POST` | `auth` | Update user display name, job title, and bio |
| `/auth/api/logout` | `GET` | Public | Clear JWT cookies and remove refresh token |
| `/auth/message/addMsg` | `POST` | `auth` | Save new message to MongoDB |
| `/auth/message/getMsg` | `POST` | `auth` | Retrieve conversation history between two users |

---

### **Socket.IO Real-Time Events**

| Event Name | Direction | Data Payload | Description |
| :--- | :--- | :--- | :--- |
| `add-user` | Client ➔ Server | `userId` | Registers connected user's socket session |
| `get-online-users` | Server ➔ Client | `[userId, ...]` | Broadcasts array of currently active user IDs |
| `send-msg` | Client ➔ Server | `{ to, from, message, createdAt }` | Sends real-time message to target socket |
| `msg-receive` | Server ➔ Client | `{ from, message, createdAt }` | Delivers incoming message to receiver |
| `typing` | Client ➔ Server ➔ Receiver | `{ to, from }` | Triggers typing indicator on target client |
| `stop-typing` | Client ➔ Server ➔ Receiver | `{ to, from }` | Hides typing indicator on target client |

---

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.