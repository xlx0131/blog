import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-[#fffaef] border-t-2 border-[#161310] py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
          </div>
        </div>

        <div className="text-center mt-6 text-[#3a332a] text-xs font-mono">
          <p>本站所有资源均来源于网络，仅供学习交流。如有侵权，请联系我们删除。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
