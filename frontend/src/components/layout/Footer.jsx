// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Code, Coffee, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-600 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 text-2xl font-bold mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg">
                BH
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BlogHub
              </span>
            </div>
            <p className="text-gray-600 dark:text-black-300 mb-4 text-lg leading-relaxed">
              A modern blogging platform where writers and readers connect. 
              Share your stories, discover amazing content, and join our growing community.
            </p>
            <div className="flex items-center space-x-4 text-black-500 dark:text-gray-400">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 dark:text-black-300 hover:text-blue-500 transition-colors">Home</Link></li>
              <li><Link to="/posts" className="text-gray-600 dark:text-blark-300 hover:text-blue-500 transition-colors">All Posts</Link></li>
              <li><Link to="/create-post" className="text-gray-600 dark:text-black-300 hover:text-blue-500 transition-colors">Write Post</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 dark:text-black-300 hover:text-blue-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-black-300 hover:text-blue-500 transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-600 dark:text-black-300 hover:text-blue-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-dark-600 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-600 dark:text-black-300 text-sm">
            © 2025 BlogHub. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-black-300">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Cookies</a>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <Code className="w-4 h-4 text-blue-500" />
            <span>and</span>
            <Coffee className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;