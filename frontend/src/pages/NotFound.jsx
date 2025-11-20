// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce">
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness. 
          Let's get you back on track!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Link to="/">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Home className="w-4 h-4" />
              Home Page
            </Button>
          </Link>
          
          <Link to="/posts">
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Browse Posts
            </Button>
          </Link>
        </div>

        {/* Fun Illustration */}
        <div className="mt-12 text-6xl animate-pulse">
          🗺️🔍
        </div>
      </div>
    </div>
  );
};

export default NotFound;