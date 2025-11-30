# SyncPad

A real-time collaborative code editor built with React, Node.js, Express, and Socket.IO. SyncPad enables multiple users to code together in real-time with instant synchronization of code changes and user presence.

## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **WebSocket Communication**: Bidirectional communication using Socket.IO for seamless code updates
- **Professional Editor**: Integrated CodeMirror with syntax highlighting and dark theme
- **User Presence**: See who's connected in the room
- **Room-based Sessions**: Create or join rooms using unique Room IDs

## Technologies

- **Frontend**: React, CodeMirror
- **Backend**: Node.js, Express
- **Real-time**: Socket.IO
- **Styling**: CSS with minimalist Claude-inspired design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sumyuck/syncpad.git
cd syncpad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the frontend (React) and backend (Express) servers concurrently.

### Development Commands

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server (with nodemon)
- `npm run start:frontend` - Start only the frontend React app
- `npm run build` - Build the React app for production
- `npm start` - Start the production server (serves built React app)

## Deployment

### Deploying to Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **Environment Variables** (optional):
   - `REACT_APP_BACKEND_URL`: Leave empty for same-origin deployment (monorepo)
   - If deploying frontend and backend separately, set this to your backend URL
5. **Deploy**

The application will be available at your Render service URL.

### Backend Configuration

The backend is self-contained in this repository. Socket.IO will automatically connect to the same origin if `REACT_APP_BACKEND_URL` is not set, which is perfect for monorepo deployments.

For separate frontend/backend deployments:
- Set `REACT_APP_BACKEND_URL` in your frontend environment to point to your backend service
- Ensure CORS is properly configured on the backend

## Usage

1. **Create a Room**: Click "new room" on the home page to generate a unique Room ID
2. **Join a Room**: Enter a Room ID and your username, then click "Join"
3. **Share the Room ID**: Copy the Room ID and share it with collaborators
4. **Start Coding**: All changes are synchronized in real-time across all connected users

## Project Structure

```
syncpad/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   └── ...
├── server.js        # Express server
├── socketHandler.js # Socket.IO event handlers
└── package.json
```

## License

This project is private and proprietary.

## Author

Built by [sumyuck](https://github.com/sumyuck)
