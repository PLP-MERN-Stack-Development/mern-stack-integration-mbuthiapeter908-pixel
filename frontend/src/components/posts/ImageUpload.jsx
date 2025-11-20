// src/components/posts/ImageUpload.jsx
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setUploading(true);
      
      // Simulate upload process
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        // In a real app, you would upload to your server here
        setTimeout(() => {
          setUploading(false);
          onImageUpload(file.name); // Simulate successful upload
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 bg-gray-50 dark:bg-gray-700/50 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-600">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
            Featured image selected
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="text-center cursor-pointer group"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <p className="font-semibold mb-1 text-base">
              {uploading ? 'Uploading...' : 'Click to upload featured image'}
            </p>
            <p className="text-sm">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;