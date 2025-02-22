import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import Navbar from "../Components/Navbar";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const AddTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    if (task.title.length > 50) {
      toast.error("Title cannot exceed 50 characters!");
      return;
    }

    if (task.description.length > 200) {
      toast.error("Description cannot exceed 200 characters!");
      return;
    }

    const newTask = {
      title: task.title,
      description: task.description,
      category: task.category,
      timestamp: new Date().toISOString(),
    };
    console.log(newTask);

    try {
      const response = await axios.post("https://task-management-application-server-phi.vercel.app/tasks", newTask);
      toast.success("Task added successfully!");

      setTask({
        title: "",
        description: "",
        category: "To-Do",
      });
    } catch (error) {
      toast.error("Error adding task!");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-5">
        <h2 className="text-xl font-bold mb-3">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              maxLength="50"
              required
              className="w-full p-2 border rounded-md focus:outline-blue-400"
              placeholder="Enter task title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              maxLength="200"
              className="w-full p-2 border rounded-md focus:outline-blue-400"
              placeholder="Enter task description (optional)..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={task.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-blue-400"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default AddTask;
