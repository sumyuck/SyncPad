import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket', 'polling'],
    };

    // Use environment variable if set
    if (process.env.REACT_APP_BACKEND_URL) {
        return io(process.env.REACT_APP_BACKEND_URL, options);
    }

    // In development, React runs on 3000, backend on 4000
    // In production, both are on same origin
    const isDevelopment = process.env.NODE_ENV === 'development';
    const backendUrl = isDevelopment 
        ? 'http://localhost:4000'  // Development: connect to Express server
        : window.location.origin; // Production: same origin
    
    return io(backendUrl, options);
};