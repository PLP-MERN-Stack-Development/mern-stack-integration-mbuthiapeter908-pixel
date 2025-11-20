// src/components/auth/AuthModal.jsx
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { X } from 'lucide-react';

const AuthModal = ({ mode = 'signin', isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Clerk Component */}
        <div className="p-6">
          {mode === 'signin' ? (
            <SignIn 
              routing="path"
              path="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                  headerTitle: "text-2xl font-bold text-gray-900 dark:text-white",
                  headerSubtitle: "text-gray-600 dark:text-gray-300",
                  socialButtonsBlockButton: "border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700",
                  formButtonPrimary: "bg-primary-500 hover:bg-primary-600 text-white",
                  footerActionLink: "text-primary-500 hover:text-primary-600",
                }
              }}
            />
          ) : (
            <SignUp 
              routing="path"
              path="/sign-up"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                  headerTitle: "text-2xl font-bold text-gray-900 dark:text-white",
                  headerSubtitle: "text-gray-600 dark:text-gray-300",
                  socialButtonsBlockButton: "border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700",
                  formButtonPrimary: "bg-primary-500 hover:bg-primary-600 text-white",
                  footerActionLink: "text-primary-500 hover:text-primary-600",
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;