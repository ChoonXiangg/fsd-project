# Full Stack Development Project

## Description

This is a full-stack real estate property management application built with Next.js and Express.js. The platform allows users to browse and search property listings for buying or renting, create and manage their own property listings, and star their favorite properties. Users can register with JWT-based authentication, manage their profiles with verified agent status, and access educational guides about real estate. The application uses a separated frontend and backend architecture with Next.js 12.3.1 and React 18.2.0 on the frontend, Express.js on the backend, and MongoDB Atlas for database storage.

## Setup and Run

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)

### 1. Install Backend Dependencies
```bash
cd node/microservices
npm install
```

### 2. Configure Environment Variables
Ensure the `.env` file exists in `node/microservices` with:
```env
MONGODB_URI=Your own MongoDB URL
JWT_SECRET=your-secret-key-here-change-this-to-something-secure (Can leave it as it is)
```

### 3. Install Frontend Dependencies
```bash
cd ../../next/fullStackWeek10lab2
npm install
```

### 4. Run the Application

You need to run both servers simultaneously:

**Terminal 1 - Backend:**
```bash
cd node/microservices
npm start
```
Backend runs on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd next/fullStackWeek10lab2
npm run dev
```
Frontend runs on http://localhost:3000

### 5. Access the Application
Open your browser and go to http://localhost:3000
