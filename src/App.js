import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const sendMessage = () => {
    if (user && text) {
      socket.emit('message', { user, text });
      setMessages([...messages, { user, text }]);
      setText('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <label>User:</label>
          <input
            type="text"
            className="form-control"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <label>Message:</label>
          <input
            type="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
          <div className="mt-4">
            <h2>Chat History</h2>
            <ul className="list-group">
              {messages.map((msg, index) => (
                <li key={index} className="list-group-item">
                  <strong>{msg.user}:</strong> {msg.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
