import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    return (
        <div className="client">
            <div className="client__avatar">
                <Avatar name={username} size={50} round="14px" />
                <span className="presence-dot" aria-label="online" />
            </div>
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
