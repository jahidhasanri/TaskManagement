import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Import Icons
import "../../navbar.css";

const Navbar = () => {
  const { handleSingOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu State

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await handleSingOut();
      toast.success("Logout successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-slate-400 p-4">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo Section (Text First) */}
        <div>
          <h1 className="text-3xl font-bold">Taskco</h1>
        </div>

        {/* Mobile Menu Icon (Middle) */}
        <div className="lg:hidden">
          {isMenuOpen ? (
            <AiOutlineClose
              className="text-3xl cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          ) : (
            <AiOutlineMenu
              className="text-3xl cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          )}
        </div>

        {/* Desktop Navigation (Hidden in Mobile) */}
        <div className="hidden lg:flex gap-10 justify-center">
          <NavLink to="/home" className="btn">Home</NavLink>
          <NavLink to="/addtask" className="btn">Add Task</NavLink>
          <NavLink to="/managetask" className="btn">Manage Task</NavLink>
        </div>

        {/* Logout Button (Always Visible, Last) */}
        <div>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden flex flex-col items-center gap-4 bg-gray-300 p-4 mt-2 rounded-md">
          <NavLink to="/home" className="btn" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/addtask" className="btn" onClick={() => setIsMenuOpen(false)}>Add Task</NavLink>
          <NavLink to="/managetask" className="btn" onClick={() => setIsMenuOpen(false)}>Manage Task</NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
