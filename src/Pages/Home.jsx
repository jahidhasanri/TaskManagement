import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import Footer from '../Components/Footer';

const Home = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  // Function to fetch and format the current time
  const fetchCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  };

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks'); // Adjust the API endpoint
        setData(response.data);
        const uniqueCategories = [
          ...new Set(response.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set up an interval to update the time every second
    const intervalId = setInterval(fetchCurrentTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle drag end event
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If the item is dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Reorder tasks in the state
    const updatedData = Array.from(data);
    const [removed] = updatedData.splice(source.index, 1);
    updatedData.splice(destination.index, 0, removed);
    setData(updatedData);

    // Update the task's category in the database
    const updatedTask = {
      ...removed,
      category: destination.droppableId,
    };

    try {
      await axios.put(`http://localhost:5000/tasks/${draggableId}`, updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className='bg-gray-200'>
      <Navbar />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-5">Category-wise Data</h1>

        {/* DragDropContext to handle drag-and-drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white p-5 rounded-lg shadow-md"
                  >
                    <h2 className="text-2xl font-semibold mb-3">{category}</h2>
                    {/* List of tasks under the category */}
                    {data
                      .filter((item) => item.category === category)
                      .map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-5 rounded-lg shadow-md mb-3"
                            >
                              <h3 className="text-xl font-semibold">{item.title}</h3>
                              <p>{item.description}</p>
                              <p className="text-sm text-gray-500">
                                Time: {formatTimestamp(item.timestamp)}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
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
