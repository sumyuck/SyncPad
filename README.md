# SyncPad

A polished real-time code collaboration space with a premium, Claude-inspired UI. Create a room, invite a teammate, and pair program instantly with live code, cursor presence, and smooth interactions.

## Highlights
- Live code sync powered by Socket.IO
- CodeMirror editor with syntax highlighting and remote cursors
- Room-based sessions with easy invite/copy actions
- Responsive, modern layout and thoughtful micro-interactions

## Stack
- **Frontend:** React, CodeMirror 5, React Router, react-hot-toast
- **Backend:** Node.js, Express, Socket.IO
- **Tooling:** npm scripts for dev/build, nodemon for server dev

## Run locally
```bash
npm install
npm run dev       # runs client and server together
```
Navigate to `http://localhost:3000` and create or join a room. Share the room ID to collaborate.

## Useful scripts
- `npm run dev` – start both client and server
- `npm run server` – backend only (with nodemon)
- `npm run start:frontend` – frontend only
- `npm run build` – production build
- `npm start` – serve the built app

## Deployment
Build with `npm run build` and start with `npm start` on any Node-friendly host (Render, Fly.io, etc.). The backend serves the built React bundle and Socket.IO from the same origin.

## License
Private project – contact the author before reuse.
