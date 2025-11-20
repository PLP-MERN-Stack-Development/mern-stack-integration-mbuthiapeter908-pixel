// src/components/posts/RichTextEditor.jsx
import React, { useRef, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Link, Image, Code, Eye, EyeOff } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing your amazing post..." }) => {
  const textareaRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const tools = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: List, action: () => insertText('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Numbered List' },
    { icon: Quote, action: () => insertText('> '), title: 'Quote' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: Link, action: () => insertText('[', '](https://)'), title: 'Link' },
    { icon: Image, action: () => insertText('![', '](https://)'), title: 'Image' },
  ];

  const renderPreview = () => {
    // Simple markdown preview (in a real app, you might use a library like marked)
    const html = value
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 text-gray-600 dark:text-gray-400">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^1\. (.*$)/gm, '<li>$1</li>')
      .split('\n')
      .map(line => {
        if (line.startsWith('<')) return line;
        return `<p class="mb-4">${line}</p>`;
      })
      .join('');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg rich-text-editor">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center space-x-2">
          {tools.map((tool, index) => (
            <button
              key={index}
              onClick={tool.action}
              className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              title={tool.title}
            >
              <tool.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300"
        >
          {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{isPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div className="p-6 prose prose-lg dark:prose-invert max-w-none min-h-[400px] text-gray-900 dark:text-gray-100">
            {renderPreview()}
            {!value && (
              <div className="text-gray-400 dark:text-gray-500 text-center py-20">
                <div className="text-4xl mb-4">👀</div>
                <p>Start writing to see the preview...</p>
              </div>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800 resize-none focus:outline-none text-lg leading-relaxed font-medium placeholder-gray-500 dark:placeholder-gray-400"
            style={{ color: 'inherit' }}
          />
        )}
      </div>

      {/* Character Count */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {value.length} characters • {value.split(/\s+/).filter(word => word.length > 0).length} words
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;