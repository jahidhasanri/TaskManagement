import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        updateState(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Update state with fetched data
  const updateState = (tasks) => {
    setTasks(tasks);
    const uniqueCategories = [...new Set(tasks.map(task => task.category))];
    // Ensure all categories are included, even if they have no tasks
    const allCategories = ['To-Do', 'In Progress', 'Done'];
    const categoriesSet = new Set([...uniqueCategories, ...allCategories]);
    setCategories(Array.from(categoriesSet));
  };

  // Handle drag and drop
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = tasks.find(task => task._id === draggableId);

    // Remove the task from the old category before adding it to the new one
    const newTasks = tasks.filter(t => t._id !== draggableId);

    // Update task category
    task.category = destination.droppableId;

    // Insert the task into its new position in the new category
    newTasks.splice(destination.index, 0, task);
    
    // Update the state with the modified tasks array
    setTasks(newTasks);

    // Update backend
    try {
      await axios.put(`http://localhost:5000/tasks/${draggableId}`, {
        ...task,
        category: destination.droppableId
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // Rollback on error
      updateState(tasks);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className='bg-gray-200 min-h-screen'>
      <Navbar />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-5">Task Management Board</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white p-4 rounded-lg shadow-lg"
                  >
                    <h2 className="text-xl font-semibold mb-4">{category}</h2>
                    {tasks
                      .filter(task => task.category === category)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 p-3 mb-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
                            >
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-gray-600 text-sm">{task.description}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Updated: {formatTimestamp(task.updatedAt || task.timestamp)}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {/* Display a message if the category has no tasks */}
                    {tasks.filter(task => task.category === category).length === 0 && (
                      <p className="text-gray-500 text-sm">No tasks in this category</p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
