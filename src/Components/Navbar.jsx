import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'react-toastify';
import '../../navbar.css'

const Navbar = () => {
    const { handleSingOut } = useContext(AuthContext);
    const navigate= useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
          await handleSingOut();
          toast.success('Logout successful!');
          setTimeout(() => navigate('/'), 2000);
        } catch (error) {
          toast.error(`Logout failed: ${error.message}`);
        }
      };
    return (
        <div className='w-full bg-slate-400 p-4'>
           <div className='container mx-auto flex items-center justify-between'>
           <div>
               <h1 className='text-3xl font-bold'>Taskco</h1>
            </div>
            <div  className='flex gap-10'>
            <NavLink to='/home' className='btn'>Home</NavLink>
                <NavLink to='/addtask' className='btn'>Add Task</NavLink>
                <NavLink to='/managetask' className='btn'>Manage Task</NavLink>
                
            </div>
            <div className='flex'>
               
                <button className='btn btn-primary' onClick={handleLogout}>Logout</button>
            </div>
           </div>
        </div>
    );
};

export default Navbar;