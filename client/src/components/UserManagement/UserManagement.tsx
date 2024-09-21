import "./UserManagement.css"
import React, { useState } from 'react';
import {produce} from 'immer';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const addUser = () => {
    setUsers((prevUsers) =>
      produce(prevUsers, (draft) => {
        draft.push({ id: Date.now(), name, email });
      })
    );
    setName('');
    setEmail('');
  };

  const editUser = (id: number, updatedName: string, updatedEmail: string) => {
    setUsers((prevUsers) =>
      produce(prevUsers, (draft) => {
        const user = draft.find((user) => user.id === id);
        if (user) {
          user.name = updatedName;
          user.email = updatedEmail;
        }
      })
    );
  };

  const removeUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <form onSubmit={(e) => { e.preventDefault(); addUser(); }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit">Add User</button>
      </form>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) 
            <div className="user-buttons">
              <button onClick={() => editUser(user.id, prompt('New name:', user.name) || user.name, prompt('New email:', user.email) || user.email)}>Edit</button>
              <button onClick={() => removeUser(user.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
