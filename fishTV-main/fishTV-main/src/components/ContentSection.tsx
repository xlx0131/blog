import React from 'react';
import { Link } from 'react-router-dom';
import ContentCard from './ContentCard';
import { Video } from '../api/types';

export interface ContentItem {
  id: number;
  title: string;
  imageUrl: string;
  rating?: string;
  episodeCount?: string;
  isNew?: boolean;
}

interface ContentSectionProps {
  title: string;
  items: (ContentItem | Video)[];
  seeMoreLink?: string;
  loading?: boolean;
}

const ContentCardSkeleton = () => {
  return (
    <div className="content-card relative bg-[#fffaef] overflow-hidden">
      <div className="relative pb-[140%] border-b-2 border-[#161310]">
        <div className="absolute inset-0 w-full h-full bg-[#d9cdb3] animate-pulse" />
      </div>
      <div className="p-3">
        <div className="h-4 bg-[#d9cdb3] animate-pulse mb-1" />
        <div className="h-3 bg-[#d9cdb3] animate-pulse w-3/4" />
      </div>
    </div>
  );
};

const ContentSection = ({ title, items, seeMoreLink, loading = false }: ContentSectionProps) => {
  const convertToContentItem = (item: ContentItem | Video): ContentItem => {
    if ('vod_id' in item) {
      return {
        id: item.vod_id,
        title: item.vod_name,
        imageUrl: item.vod_pic,
        rating: item.vod_score?.toString(),
      };
    }
    return item;
  };

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="category-heading text-base md:text-lg font-bold font-mono">{title}</h2>
        {seeMoreLink && (
          <Link to={seeMoreLink} className="text-xs md:text-sm font-mono text-[#3a332a] hover:text-[#2e5dd6] font-bold">
            查看更多 ▸
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <ContentCardSkeleton key={index} />
          ))
        ) : (
          items.map((item) => {
            const contentItem = convertToContentItem(item);
            return (
              <ContentCard
                key={contentItem.id}
                id={contentItem.id}
                title={contentItem.title}
                imageUrl={contentItem.imageUrl}
                rating={contentItem.rating}
                episodeCount={contentItem.episodeCount}
                isNew={contentItem.isNew}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContentSection;
