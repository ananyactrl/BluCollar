import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './MessageChat.css';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function MessageChat({ job_id }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const threadRef = useRef(null);

  // Get sender_id and sender_role from localStorage or context
  let sender_id = null;
  let sender_role = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      sender_id = user.id;
      sender_role = user.role || 'client'; // Adjust as per your user object
    }
  } catch (e) {}
  // Fallback for demo
  if (!sender_id) sender_id = 101;
  if (!sender_role) sender_role = 'client';

  useEffect(() => {
    if (!job_id) return;
    // Fetch chat history
    axios.get(`${SOCKET_URL}/api/messages/${job_id}`)
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));

    // Connect to socket
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinRoom', { job_id });

    // Listen for new messages
    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [job_id]);

  useEffect(() => {
    // Scroll to bottom on new message
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      job_id,
      sender_id,
      sender_role,
      message: input.trim(),
    };
    socketRef.current.emit('sendMessage', msg);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Job Chat</h2>
        <span className="chat-job-label">Job #{job_id}</span>
      </div>
      <div className="chat-thread" ref={threadRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender_id === sender_id ? 'self' : 'other'}`}
          >
            {msg.sender_id !== sender_id && (
              <span className="chat-avatar" role="img" aria-label="avatar">😊</span>
            )}
            <div style={{ flex: 1 }}>
              <div className="chat-meta">
                <span className="chat-sender">{msg.sender_role}</span>
                <span className="chat-time">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}</span>
              </div>
              <div className="chat-bubble">{msg.message}</div>
            </div>
          </div>
        ))}
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
} 