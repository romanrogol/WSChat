const WebSocket = require('ws');
const fs = require('fs');

const PORT = 8080;

// Загрузка пользователей из файла
let users = {};
try {
  const data = fs.readFileSync('users.json', 'utf8');
  users = JSON.parse(data);
} catch (err) {
  console.error('Ошибка при загрузке пользователей:', err);
  users = {};
}

// Создание WebSocket сервера
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket server started on ws://localhost:${PORT}`);
});

// Обработка новых подключений
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Обработка сообщений от клиента
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(ws, data);
    } catch (err) {
      console.error('Ошибка при парсинге сообщения:', err);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  // Обработка отключения клиента
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Обработка сообщений
function handleMessage(ws, data) {
  switch (data.type) {
    case 'auth':
      handleAuth(ws, data);
      break;
    case 'message':
      handleMessageSend(ws, data);
      break;
    case 'register':
      handleRegister(ws, data);
      break;
    default:
      ws.send(JSON.stringify({ error: 'Invalid message type' }));
  }
}

// Обработка авторизации
function handleAuth(ws, data) {
  const { username, password } = data;

  if (users[username] && users[username].password === password) {
    ws.user = username;
    ws.send(JSON.stringify({ type: 'auth', success: true }));
  } else {
    ws.send(JSON.stringify({ type: 'auth', success: false }));
  }
}

// Обработка отправки сообщения
function handleMessageSend(ws, data) {
  const { message } = data;
  if (ws.user) {
    wss.clients.forEach((client) => {
      if (client.user) {
        client.send(JSON.stringify({ type: 'message', sender: ws.user, message }));
      }
    });
  } else {
    ws.send(JSON.stringify({ error: 'Unauthorized' }));
  }
}

// Обработка регистрации нового пользователя
function handleRegister(ws, data) {
  const { username, password } = data;

  if (users[username]) {
    ws.send(JSON.stringify({ type: 'register', success: false, error: 'Username already exists' }));
    return;
  }

  users[username] = { password };
  saveUsers();
  ws.send(JSON.stringify({ type: 'register', success: true }));
}

// Сохранение пользователей в файл
function saveUsers() {
  fs.writeFileSync('users.json', JSON.stringify(users));
}

// Запуск сервера
wss.on('listening', () => {
  // Создание нового пользователя при запуске
  // users.testUser = { password: 'test' };
  // saveUsers();
});
