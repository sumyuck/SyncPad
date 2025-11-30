# SyncPad

Lightweight real-time code collaboration. Create a room, share the ID, and pair instantly with synced code, cursors, and a clean dark UI.

## Highlights
- Live code sync powered by Socket.IO
- CodeMirror editor with syntax highlighting and remote cursors
- Room-based sessions with quick invite/copy actions
- Responsive, minimal layout tuned for focus

## Stack
- **Frontend:** React, CodeMirror 5, React Router, react-hot-toast
- **Backend:** Node.js, Express, Socket.IO
- **Tooling:** npm scripts for dev/build, nodemon for server dev

## Run locally
```bash
npm install
npm run dev       # runs client and server together
```
Open `http://localhost:3000`, create or join a room, and share the room ID to collaborate.

## Useful scripts
- `npm run dev` – start both client and server
- `npm run server` – backend only (with nodemon)
- `npm run start:frontend` – frontend only
- `npm run build` – production build
- `npm start` – serve the built app

## Deployment
Build with `npm run build` and start with `npm start` on any Node-friendly host. The backend serves the built React bundle and Socket.IO from the same origin.

## License
Private project – contact the author before reuse.
