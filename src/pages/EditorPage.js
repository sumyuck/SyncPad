import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const STATUS_COPY = {
    connecting: 'Connecting to room…',
    connected: 'Live and syncing',
    disconnected: 'Reconnecting…',
};

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [socketReady, setSocketReady] = useState(false);

    const username = location.state?.username;

    const handleCodeChange = useCallback((code) => {
        codeRef.current = code;
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();
                setSocketReady(true);
            } catch (err) {
                toast.error('Unable to start a live session.');
                reactNavigator('/');
                return;
            }

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                setConnectionStatus('disconnected');
                reactNavigator('/');
            };

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            const joinRoom = () => {
                socketRef.current?.emit(ACTIONS.JOIN, {
                    roomId,
                    username,
                });
            };

            socketRef.current.on('connect', () => {
                setConnectionStatus('connected');
                joinRoom();
            });

            socketRef.current.on('disconnect', () => {
                setConnectionStatus('disconnected');
            });

            if (socketRef.current.connected) {
                setConnectionStatus('connected');
                joinRoom();
            }

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients: roomClients, username: joinedUser, socketId }) => {
                    if (joinedUser && joinedUser !== username) {
                        toast.success(`${joinedUser} joined the room.`);
                    }
                    setClients(roomClients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username: leftUser }) => {
                    if (leftUser) {
                        toast(`${leftUser} left the room.`);
                    }

                    setClients((prev) =>
                        prev.filter((client) => client.socketId !== socketId)
                    );
                }
            );
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.off('connect_error');
                socketRef.current.off('connect_failed');
                socketRef.current.off('connect');
                socketRef.current.off('disconnect');
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.disconnect();
            }
        };
    }, [roomId, reactNavigator, username]);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied.');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    };

    const leaveRoom = () => {
        reactNavigator('/');
    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="workspace">
            <aside className="workspace__aside">
                <div className="brand">
                    <div className="brand__mark">✺</div>
                    <div>
                        <p className="eyebrow">SyncPad</p>
                        <strong>Shared editor</strong>
                    </div>
                </div>

                <div className="room-card">
                    <p className="eyebrow">Room ID</p>
                    <h4 className="room-card__id">{roomId}</h4>
                    <p className="room-card__hint">
                        Share this ID to invite others.
                    </p>
                </div>

                <div className="client-section">
                    <div className="client-section__header">
                        <p className="eyebrow">Participants</p>
                        <span className="counter">{clients.length}</span>
                    </div>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
            </aside>

            <section className="workspace__editor">
                <header className="workspace__toolbar">
                    <div>
                        <p className="eyebrow">Status</p>
                        <div className="status">
                            <span
                                className={`status__dot status__dot--${connectionStatus}`}
                            ></span>
                            <span>{STATUS_COPY[connectionStatus]}</span>
                        </div>
                    </div>
                    <div className="toolbar__actions">
                        <button className="ghost-btn" onClick={copyRoomId}>
                            Copy room ID
                        </button>
                        <button className="danger-btn" onClick={leaveRoom}>
                            Leave room
                        </button>
                    </div>
                </header>

                <div className="editorWrap">
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={handleCodeChange}
                        username={username}
                        socketReady={socketReady}
                    />
                </div>
            </section>
        </div>
    );
};

export default EditorPage;
