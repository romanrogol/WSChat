import React from 'react';
import Chat from './components/Chat/Chat.tsx';
import UserManagement from './components/UserManagement/UserManagement.tsx';
import TaskManager from './components/TaskManager/TaskManager.tsx';

const App: React.FC = () => {
  return (
    <div>
      <UserManagement />
      <TaskManager />
      <Chat />
    </div>
  );
};

export default App;



