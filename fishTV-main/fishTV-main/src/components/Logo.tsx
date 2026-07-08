import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <img
        src="/img.png"
        alt="QQ星TV"
        className="w-8 h-8 mr-2"
      />
      <span className="text-xl font-bold freeok-logo">QQ星TV</span>
    </div>
  );
};

export default Logo;
