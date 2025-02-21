import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Section 1: Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-3">TaskMaster</h3>
            <p className="text-sm">A simple and efficient task management app designed to help you stay organized and productive.</p>
          </div>

          {/* Section 2: Useful Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-400">Home</a></li>
              <li><a href="#" className="hover:text-gray-400">Manage Tasks</a></li>
              <li><a href="#" className="hover:text-gray-400">About</a></li>
              <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Section 3: Contact & Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@taskmaster.com</li>
              <li>Phone: +1 (123) 456-7890</li>
            </ul>
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-linkedin-in"></i> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          <p>&copy; 2025 TaskMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
