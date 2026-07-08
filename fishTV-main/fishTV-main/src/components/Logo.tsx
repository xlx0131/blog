import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <img
        src={`${import.meta.env.BASE_URL}avatar.jpg`}
        alt="QQ星TV"
        className="w-8 h-8 mr-2 border-2 border-[#161310]"
      />
      <span className="text-xl font-bold freeok-logo">QQ星TV</span>
    </div>
  );
};

export default Logo;
