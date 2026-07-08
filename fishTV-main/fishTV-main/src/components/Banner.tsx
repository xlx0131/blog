import React from 'react';

interface BannerProps {
  title: string;
  imageUrl: string;
  description?: string;
}

const Banner = ({ title, imageUrl, description }: BannerProps) => {
  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden mb-4 md:mb-6 border-2 border-[#161310] shadow-[6px_6px_0_0_#161310]">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover bg-[#fffaef]"
      />

      {/* Pixel style overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#161310]/90 via-[#161310]/40 to-transparent">
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          <div className="inline-block px-4 py-2 bg-[#fffaef] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] mb-3">
            <h2 className="text-[#161310] text-lg md:text-xl lg:text-2xl font-mono font-black tracking-wide">{title}</h2>
          </div>
          {description && (
            <p className="text-[#fffaef] text-xs md:text-sm lg:text-base font-mono line-clamp-2 max-w-xl">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
