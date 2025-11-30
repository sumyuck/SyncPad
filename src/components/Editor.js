import React, { useCallback, useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange, username }) => {
    const editorRef = useRef(null);
    const cursorMarkersRef = useRef(new Map());
    const lastCursorRef = useRef('');

    const getColorForSocket = useCallback((socketId) => {
        let hash = 0;
        for (let i = 0; i < socketId.length; i += 1) {
            hash = socketId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 80%, 60%)`;
    }, []);

    const clearRemoteCursor = useCallback((socketId) => {
        const markers = cursorMarkersRef.current.get(socketId);
        if (!markers) return;
        markers.caret?.clear?.();
        markers.selection?.clear?.();
        cursorMarkersRef.current.delete(socketId);
    }, []);

    const renderRemoteCursor = useCallback(
        ({ socketId, username: remoteUser, cursor }) => {
            if (!editorRef.current || !cursor || !cursor.head) return;

            const doc = editorRef.current.getDoc();
            const head = cursor.head;
            const anchor = cursor.anchor || head;

            clearRemoteCursor(socketId);

            const color = getColorForSocket(socketId);
            const caret = document.createElement('span');
            caret.className = 'cm-remote-caret';
            caret.style.borderColor = color;
            caret.style.boxShadow = `0 0 0 1px ${color}`;

            const label = document.createElement('span');
            label.className = 'cm-remote-caret__label';
            label.style.background = color;
            label.textContent = remoteUser || 'Guest';
            caret.appendChild(label);

            const bookmark = doc.setBookmark(head, {
                widget: caret,
                insertLeft: true,
                handleMouseEvents: true,
            });

            let selectionMarker = null;
            const anchorPos = anchor.line < head.line || (anchor.line === head.line && anchor.ch <= head.ch)
                ? anchor
                : head;
            const headPos = anchorPos === anchor ? head : anchor;

            if (anchorPos.line !== headPos.line || anchorPos.ch !== headPos.ch) {
                selectionMarker = doc.markText(anchorPos, headPos, {
                    className: 'cm-remote-selection',
                    css: `background-color: ${color}1f;`,
                    inclusiveLeft: false,
                    inclusiveRight: false,
                });
            }

            cursorMarkersRef.current.set(socketId, {
                caret: bookmark,
                selection: selectionMarker,
            });
        },
        [clearRemoteCursor, getColorForSocket]
    );
    useEffect(() => {
        let cleanup = () => {};

        const init = async () => {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'default',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    tabSize: 2,
                    indentUnit: 2,
                }
            );

            editorRef.current.setSize(null, '100%');

            const handleChange = (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue' && socketRef.current) {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            };

            editorRef.current.on('change', handleChange);

            const debounceCursor = (() => {
                let timer = null;
                return (fn) => {
                    clearTimeout(timer);
                    timer = setTimeout(fn, 35);
                };
            })();

            const handleCursorActivity = () => {
                const doc = editorRef.current.getDoc();
                const head = doc.getCursor('head');
                const anchor = doc.getCursor('anchor');

                const signature = `${head.line}:${head.ch}-${anchor.line}:${anchor.ch}`;
                if (signature === lastCursorRef.current) return;
                lastCursorRef.current = signature;

                debounceCursor(() => {
                    if (!socketRef.current) return;
                    socketRef.current.emit(ACTIONS.CURSOR_CHANGE, {
                        roomId,
                        cursor: { head, anchor },
                        username,
                    });
                });
            };

            editorRef.current.on('cursorActivity', handleCursorActivity);

            cleanup = () => {
                cursorMarkersRef.current.forEach(({ caret, selection }) => {
                    caret?.clear?.();
                    selection?.clear?.();
                });
                cursorMarkersRef.current.clear();
                editorRef.current?.off('change', handleChange);
                editorRef.current?.off('cursorActivity', handleCursorActivity);
                editorRef.current?.toTextArea();
            };
        };

        init();

        return () => cleanup();
    }, [roomId, onCodeChange, socketRef]);

    useEffect(() => {
        if (!socketRef.current) return undefined;

        const handleCodeChange = ({ code }) => {
            if (code !== null && code !== editorRef.current.getValue()) {
                editorRef.current.setValue(code);
            }
        };

        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

        return () => {
            socketRef.current?.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        };
    }, [socketRef]);

    useEffect(() => {
        if (!socketRef.current) return undefined;

        const handleCursorChange = (payload) => {
            if (payload?.socketId === socketRef.current.id) return;
            renderRemoteCursor(payload);
        };

        const handleDisconnect = ({ socketId }) => {
            clearRemoteCursor(socketId);
        };

        socketRef.current.on(ACTIONS.CURSOR_CHANGE, handleCursorChange);
        socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnect);

        return () => {
            socketRef.current?.off(ACTIONS.CURSOR_CHANGE, handleCursorChange);
            socketRef.current?.off(ACTIONS.DISCONNECTED, handleDisconnect);
        };
    }, [clearRemoteCursor, renderRemoteCursor, socketRef]);

    return <textarea id="realtimeEditor" spellCheck="false"></textarea>;
};

export default Editor;
