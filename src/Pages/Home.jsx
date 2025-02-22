import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import Navbar from "../Components/Navbar";

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};

const Home = () => {
  const [groupedTasks, setGroupedTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });
  const categories = ["To-Do", "In Progress", "Done"];
  const currentTime = useCurrentTime(); // Updates every second

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://task-management-application-server-phi.vercel.app/tasks"
        );
        updateState(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Update state with fetched data
  const updateState = (tasks) => {
    const grouped = categories.reduce(
      (acc, category) => {
        acc[category] = tasks.filter((task) => task.category === category);
        return acc;
      },
      { "To-Do": [], "In Progress": [], Done: [] }
    );

    setGroupedTasks(grouped);
  };

  // Handle drag and drop
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceTasks = Array.from(groupedTasks[source.droppableId]);
    const destTasks =
      destination.droppableId === source.droppableId
        ? sourceTasks
        : Array.from(groupedTasks[destination.droppableId]);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    const updatedTask = {
      ...movedTask,
      category: destination.droppableId,
      updatedAt: new Date().toISOString(), // Update timestamp on move
    };

    destTasks.splice(destination.index, 0, updatedTask);

    const newGroupedTasks = {
      ...groupedTasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    };

    setGroupedTasks(newGroupedTasks);

    try {
      await axios.put(
        `https://task-management-application-server-phi.vercel.app/tasks/${draggableId}`,
        updatedTask
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setGroupedTasks(groupedTasks);
    }
  };

  // Custom timestamp formatting
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "--/--/----, --:--:--";

    const date = new Date(timestamp);
    if (isNaN(date)) return "--/--/----, --:--:--";

    const pad = (num) => num.toString().padStart(2, "0");

    return [
      `${pad(date.getDate())}-${pad(
        date.getMonth() + 1
      )}-${date.getFullYear()}`,
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`,
    ].join(", ");
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-5">Task Management Board</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white p-4 rounded-lg shadow-lg"
                  >
                    <h2 className="text-xl font-semibold mb-4">{category}</h2>
                    {groupedTasks[category].map((task, index) => (
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
                            className="bg-gray-200 p-3 mb-2 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-move"
                          >
                            <h3 className="font-medium text-xl">{task.title}</h3>
                            <p className="text-gray-400 text-lg">
                              {task.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 mb-2">
  Updated: {task.updatedAt ? formatTimestamp(task.updatedAt) : formatTimestamp(task.timestamp)}
</p>
                            {task.category === "To-Do" && (
                              <li className="w-[90px] h-[40px] text-center text-xl font-semibold pt-1 text-white rounded-2xl bg-purple-600 list-none">
                                To-Do
                              </li>
                            )}
                            {task.category === "In Progress" && (
                              <li className="w-[130px] h-[40px] text-center text-xl font-semibold pt-1 text-white rounded-2xl bg-yellow-500 list-none">
                                In Progress
                              </li>
                            )}
                            {task.category === "Done" && (
                              <li className="w-[90px] h-[40px] text-center text-xl font-semibold pt-1 text-white rounded-2xl bg-green-500 list-none">
                               Done
                              </li>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {groupedTasks[category].length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No tasks in this category
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Home;
