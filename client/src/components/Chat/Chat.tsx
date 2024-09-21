import './Chat.css';
import React, { useEffect, useState } from 'react';

const Chat: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');

    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, { sender: data.sender, message: data.message }]);
      } else if (data.type === 'auth') {
        if (data.success) {
          setIsAuthenticated(true);
          setError(''); // Очищаем ошибку
          console.log('Authentication successful');
        } else {
          setError('Authentication failed');
          console.error('Authentication failed');
        }
      } else if (data.type === 'register') {
        if (data.success) {
          setError(''); // Очищаем ошибку
          console.log('Registration successful');
          handleAuth(); // Автоматически выполняем авторизацию после успешной регистрации
        } else {
          setError(data.error || 'Registration failed');
          console.error('Registration failed:', data.error);
        }
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && input) {
      ws.send(JSON.stringify({ type: 'message', message: input }));
      setInput('');
    } else {
      console.error('WebSocket is not open. Current state:', ws?.readyState);
    }
  };

  const handleAuth = () => {
    if (ws && username && password) {
      const authData = {
        type: 'auth',
        username,
        password,
      };
      ws.send(JSON.stringify(authData));
    } else {
      console.error('Username and password must be provided for authentication.');
    }
  };

  const handleRegister = () => {
    if (ws ) {
      const registerData = {
        type: 'register',
        username,
        password,
      };
      ws.send(JSON.stringify(registerData));
    } else {
      console.error('Username and password must be provided for registration.');
    }
  };

  return (
    <div className='chat'>
      <h2>Chat</h2>
      {!isAuthenticated && (
        <div className='registration'>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleAuth}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
      {isAuthenticated && (
        <>
          <div className='message-list'>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}</strong>: {msg.message}
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
};

export default Chat;
