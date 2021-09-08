import React from 'react';

export const Wrapper: React.FC = ({ children}) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
      { children }
      </div>
    </div>
  );
};
