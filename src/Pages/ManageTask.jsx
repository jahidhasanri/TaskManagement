import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the toast styles
import Navbar from '../Components/Navbar';

const ManageTask = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    category: 'To-Do',
  });

  // Fetch tasks from the server when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://task-management-application-server-phi.vercel.app/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };

    fetchTasks();
  }, []);

  // Handle delete task
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`https://task-management-application-server-phi.vercel.app/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error('Failed to delete task!');
    }
  };


  // Handle edit task
   // Handle edit task
   const handleEdit = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setCurrentTask(task);
      setModalVisible(true);
    }
  };

  // Handle updating the task
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://task-management-application-server-phi.vercel.app/tasks/${currentTask._id}`, currentTask);
      setTasks(tasks.map((task) => (task._id === currentTask._id ? response.data : task)));
      setModalVisible(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error("Error updating task", error);
      toast.error('Failed to update task!');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-5">Manage Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <p className="mb-2">{task.description}</p>
                <p className="mb-2"><strong>Category:</strong> {task.category}</p>
                <div className="flex items-center gap-10">
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3">Edit Task</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="w-full p-2 border rounded-md focus:outline-blue-400"
                  placeholder="Enter task title..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={currentTask.description}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  className="w-full p-2 border rounded-md focus:outline-blue-400"
                  placeholder="Enter task description..."
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={currentTask.category}
                  onChange={(e) => setCurrentTask({ ...currentTask, category: e.target.value })}
                  className="w-full p-2 border rounded-md focus:outline-blue-400"
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)} // Close the modal
                  className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer /> {/* Add ToastContainer to display toasts */}
    </div>
  );
};

export default ManageTask;
