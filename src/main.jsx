import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthProvider from './Provider/AuthProvider.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Home from './Pages/Home.jsx';
import AddTask from './Pages/Addtask.jsx';
import ManageTask from './Pages/ManageTask.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element:<Login></Login>,
  },
  {
    path:'/register',
    element:<Register></Register>
  },
  {
    path:'/home',
    element:<Home></Home>,
  },
  {
    path:'/addtask',
    element:<AddTask></AddTask>
  },
  {
    path:'/managetask',
    element:<ManageTask></ManageTask>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
      <RouterProvider router={router} />
  </AuthProvider>,
  </StrictMode>
)
