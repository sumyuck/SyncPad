import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = () => {
        const id = uuidV4();
        setRoomId(id);
        toast.success('New room ID generated.');
    };

    const joinRoom = () => {
        if (!roomId.trim() || !username.trim()) {
            toast.error('Room ID and username are required.');
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username: username.trim(),
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.key === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="page page--home">
            <div className="topbar">
                <span className="brand-mark">
                    <span className="brand-icon" aria-hidden>
                        ✺
                    </span>
                    SyncPad
                </span>
                <span>Real-time code rooms</span>
            </div>

            <div className="home-grid">
                <div className="home-copy">
                    <span className="home-badge">Minimal, steady collaboration</span>
                    <h1>Drop into a room and code together.</h1>
                    <p>
                        Create a room, share the ID, and collaborate in seconds. Smooth
                        edits, synced cursors, and a focused workspace keep everyone in
                        flow.
                    </p>
                    <p className="hint">No accounts. No fuss. Just real-time pairing.</p>
                </div>

                <div className="home-card">
                    <div className="card-header">
                        <div>
                            <p className="eyebrow">Start a session</p>
                            <h3>Join or create</h3>
                        </div>
                        <button className="ghost-btn" onClick={createNewRoom}>
                            Generate ID
                        </button>
                    </div>

                    <div className="input-grid">
                        <label className="field">
                            <span className="field__label">Room ID</span>
                            <input
                                type="text"
                                className="input"
                                placeholder="Paste an invite or generate a new one"
                                onChange={(e) => setRoomId(e.target.value)}
                                value={roomId}
                                onKeyDown={handleInputEnter}
                            />
                        </label>
                        <label className="field">
                            <span className="field__label">Display name</span>
                            <input
                                type="text"
                                className="input"
                                placeholder="How should others see you?"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                onKeyDown={handleInputEnter}
                            />
                        </label>
                    </div>

                    <button className="primary-btn" onClick={joinRoom}>
                        Enter workspace
                    </button>
                    <p className="hint">Share the room ID with anyone to co-edit.</p>
                </div>
            </div>

            <footer className="footer">
                <p>
                    Built by &nbsp;
                    <a href="https://github.com/sumyuck" target="_blank" rel="noreferrer">
                        sumyuck
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
