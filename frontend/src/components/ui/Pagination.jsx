// src/components/ui/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);
  
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <Button
            onClick={() => onPageChange(1)}
            variant={1 === currentPage ? 'primary' : 'outline'}
            size="sm"
          >
            1
          </Button>
          {startPage > 2 && <span className="text-gray-500 px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? 'primary' : 'outline'}
          size="sm"
          className={page === currentPage ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}
        >
          {page}
        </Button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500 px-2">...</span>}
          <Button
            onClick={() => onPageChange(totalPages)}
            variant={totalPages === currentPage ? 'primary' : 'outline'}
            size="sm"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;