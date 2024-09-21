const WebSocket = require('ws');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket('ws://localhost:8080');

let isAuthenticated = false;
let username = 'user2';

function registerUser(username, password) {
    const registerData = {
      type: 'register',
      username,
      password,
    };
    ws.send(JSON.stringify(registerData));
  }

ws.on('open', () => {
  console.log('Соединение установлено');
  registerUser("user2", "password2")
  const authData = {
    type: 'auth',
    username,
    password: 'password2', // Замените на реальный пароль
  };
  ws.send(JSON.stringify(authData));
});

ws.on('message', (message) => {
  const data = JSON.parse(message);

  if (data.type === 'auth') {
    if (data.success) {
      isAuthenticated = true;
      console.log('Авторизация прошла успешно');
      readline.question('Введите сообщение: ', (message) => {
        sendMessage(message);
      });
    } else {
      console.error('Ошибка авторизации');
      process.exit(1);
    }
  } else if (data.type === 'message') {
    console.log(`[${data.sender}]: ${data.message}`);
    if (isAuthenticated) {
      readline.question('Введите сообщение: ', (message) => {
        sendMessage(message);
      });
    }
  }
});

ws.on('close', () => {
  console.log('Соединение закрыто');
  process.exit(0);
});

function sendMessage(message) {
  const messageData = {
    type: 'message',
    message,
  };
  ws.send(JSON.stringify(messageData));
}
