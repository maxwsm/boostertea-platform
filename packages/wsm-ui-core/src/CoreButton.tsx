import React from 'react';

export const CoreButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}
    >
      {children}
    </button>
  );
};
