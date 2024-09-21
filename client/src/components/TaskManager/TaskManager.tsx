import React, { useState } from 'react';
import { produce } from 'immer';
import "./TaskManager.css";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Category {
  id: number;
  name: string;
  tasks: Task[];
}

const TaskManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  const addCategory = () => {
    setCategories((prev) =>
      produce(prev, (draft) => {
        draft.push({ id: Date.now(), name: categoryName, tasks: [] });
      })
    );
    setCategoryName('');
  };

  const addTask = (categoryId: number) => {
    setCategories((prev) =>
      produce(prev, (draft) => {
        const category = draft.find((cat) => cat.id === categoryId);
        if (category) {
          category.tasks.push({ id: Date.now(), title: taskTitle, completed: false });
        }
      })
    );
    setTaskTitle('');
  };

  const toggleTaskCompletion = (categoryId: number, taskId: number) => {
    setCategories((prev) =>
      produce(prev, (draft) => {
        const category = draft.find((cat) => cat.id === categoryId);
        const task = category?.tasks.find((t) => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
        }
      })
    );
  };

  const deleteTask = (categoryId: number, taskId: number) => {
    setCategories((prev) =>
      produce(prev, (draft) => {
        const category = draft.find((cat) => cat.id === categoryId);
        if (category) {
          category.tasks = category.tasks.filter((task) => task.id !== taskId);
        }
      })
    );
  };

  const deleteCategory = (categoryId: number) => {
    setCategories((prev) =>
      produce(prev, (draft) => {
        return draft.filter((cat) => cat.id !== categoryId);
      })
    );
  };

  return (
    <div className='task-manager'>
      <h2>Task Manager</h2>
      <form onSubmit={(e) => { e.preventDefault(); addCategory(); }}>
        <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Category Name" required />
        <button type="submit">Add Category</button>
      </form>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name} <button onClick={() => deleteCategory(category.id)}>Delete Category</button></h2>
          <form onSubmit={(e) => { e.preventDefault(); addTask(category.id); }}>
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task Title" required />
            <button type="submit">Add Task</button>
          </form>
          <ul className='task-list'>
            {category.tasks.map((task) => (
              <li key={task.id}>
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                <div className='task-list-buttons'>
                  <button onClick={() => toggleTaskCompletion(category.id, task.id)}>Toggle Complete</button>
                  <button onClick={() => deleteTask(category.id, task.id)}>Delete Task</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskManager;
