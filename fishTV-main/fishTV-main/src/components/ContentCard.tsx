import React from 'react';
import { Link } from 'react-router-dom';
import { VIDEO_SOURCES } from '../api/config';

interface ContentCardProps {
  id: number;
  title: string;
  imageUrl: string;
  rating?: string;
  episodeCount?: string;
  isNew?: boolean;
  source?: keyof typeof VIDEO_SOURCES;
}

const ContentCard = ({ id, title, imageUrl, rating, episodeCount, isNew, source }: ContentCardProps) => {
  return (
    <Link to={`/detail/${id}${source ? `/${source}` : ''}`} className="block">
      <div className="content-card relative bg-[#fffaef] overflow-hidden">
        <div className="relative pb-[140%] border-b-2 border-[#161310]">
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 left-2 rating-badge">
              {rating}
            </div>
          )}

          {/* Episode count */}
          {episodeCount && (
            <div className="absolute top-2 right-2 bg-[#161310] text-[#fffaef] text-xs px-2 py-1 border-2 border-[#fffaef] font-mono font-bold">
              {episodeCount}
            </div>
          )}

          {/* New badge */}
          {isNew && (
            <div className="absolute top-2 right-2 bg-[#e74c3c] text-[#fffaef] text-xs px-2 py-1 border-2 border-[#fffaef] font-mono font-bold">
              NEW
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-[#161310]/50">
            <div className="play-icon p-3 bg-[#fffaef] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-sm font-mono font-bold line-clamp-1 text-[#161310]" title={title}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
