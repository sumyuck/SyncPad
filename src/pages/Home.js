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
        toast.success('A fresh room ID is ready to share.');
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
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />
            <div className="home-shell">
                <div className="home-copy">
                    <p className="eyebrow">Collaborative coding, reimagined</p>
                    <h1>
                        SyncPad Studio
                        <span className="accent-chip">Live</span>
                    </h1>
                    <p className="lede">
                        Join or create a secure room and experience buttery-smooth
                        real-time collaboration with your team.
                    </p>
                    <div className="pill-row">
                        <span className="pill">No installs required</span>
                        <span className="pill pill--accent">
                            Orange-glow collaboration
                        </span>
                    </div>
                </div>

                <div className="card form-card">
                    <div className="card__header">
                        <div>
                            <p className="eyebrow">Jump into a session</p>
                            <h3>Join a live room</h3>
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
                    <p className="hint">
                        Tip: share the room ID with a teammate to start co-editing
                        instantly.
                    </p>
                </div>
            </div>

            <footer className="footer">
                <p>
                    Built with care by &nbsp;
                    <a href="https://github.com/sumyuck" target="_blank" rel="noreferrer">
                        sumyuck
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
