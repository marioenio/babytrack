import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};