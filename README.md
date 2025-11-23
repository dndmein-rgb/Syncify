Syncify

A real-time team communication platform designed for seamless collaboration and productivity. Syncify allows teams to chat, share files, and manage projects in a unified workspace.

Features

Real-time Messaging: Instant messaging with multiple channels and direct messages.

User Authentication: Secure sign-up, login, and profile management.

File Sharing: Upload and share files directly within channels.

Notifications: Receive updates when new messages arrive.

Profile Customization: Update profile and cover images, edit bio, and manage account settings.

Responsive Design: Works on desktop and mobile devices.

Tech Stack

Frontend: React, Tailwind CSS, Vite, React Router, React Query

Backend: Node.js, Express, MongoDB, Mongoose

Authentication: JWT-based authentication with secure cookies

File Storage: Cloudinary for media uploads

Realtime Updates: WebSocket or long-polling (if implemented)

Getting Started
Prerequisites

Node.js >= 18

MongoDB instance (local or cloud)

Cloudinary account for media storage

Installation

Clone the repository:

git clone https://github.com/yourusername/syncify.git
cd syncify


Install dependencies for both frontend and backend:

npm install
npm install --prefix frontend


Create a .env file in the backend folder with the following variables:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
