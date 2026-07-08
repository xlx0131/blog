import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VIDEO_SOURCES } from '../api/config';

interface VideoDetailProps {
  id: string;
  title: string;
  coverUrl: string;
  year: string;
  area: string;
  type: string;
  description: string | { __html: string };
  episodeCount: number;
  episodeNames?: string[];
  currentEpisode?: number;
  currentSource: keyof typeof VIDEO_SOURCES;
  onSourceChange?: (source: keyof typeof VIDEO_SOURCES) => void;
  // Add more props as needed
}

const VideoDetail = ({
  id,
  title,
  coverUrl,
  year,
  area,
  type,
  description,
  episodeCount,
  episodeNames = [],
  currentEpisode = 1,
  currentSource,
  onSourceChange,
}: VideoDetailProps) => {
  // Generate episode numbers for the pagination
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div className="pt-6">
      {/* Video header section */}
      <div className="bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#161310] font-mono border-b-2 border-dashed border-[#d9cdb3] pb-3">
            {title}
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Cover image */}
            <div className="w-1/2 mx-auto md:w-1/4">
              <div className="relative pb-[140%] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310]">
                <img
                  src={coverUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Video details */}
            <div className="w-full md:w-3/4">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#2e5dd6] text-[#fffaef] border-2 border-[#161310] font-mono text-sm font-bold">{year}</span>
                <span className="px-3 py-1 bg-[#f5f0e8] text-[#161310] border-2 border-[#161310] font-mono text-sm font-bold">{area}</span>
                <span className="px-3 py-1 bg-[#f5f0e8] text-[#161310] border-2 border-[#161310] font-mono text-sm font-bold">{type}</span>
              </div>

              <div 
                className="text-[#161310] mb-6 font-mono text-sm leading-relaxed"
                dangerouslySetInnerHTML={typeof description === 'string' ? { __html: description } : description}
              />

              <div className="flex gap-3 items-center flex-wrap">
                <Link
                  to={`/play/${id}/${currentEpisode}/${currentSource}`}
                  className="flex items-center px-6 py-2.5 bg-[#2e5dd6] text-[#fffaef] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] hover:shadow-[4px_4px_0_0_#161310] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-mono font-bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 4l10 6-10 6V4z" />
                  </svg>
                  立即播放
                </Link>

                <button className="flex items-center px-5 py-2.5 border-2 border-[#161310] text-[#161310] bg-[#fffaef] shadow-[3px_3px_0_0_#161310] hover:shadow-[4px_4px_0_0_#161310] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-mono font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode selection */}
      <div className="bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] p-6 mb-6">
        <div className="mb-4 border-b-2 border-dashed border-[#d9cdb3] pb-3">
          <h2 className="text-lg font-bold font-mono text-[#161310]">选集播放</h2>

          {/* Source tabs */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {Object.entries(VIDEO_SOURCES).map(([key, source]) => (
              <button
                key={key}
                className={`px-4 py-1.5 border-2 border-[#161310] transition-all font-mono text-sm font-bold ${
                  currentSource === key
                    ? 'bg-[#2e5dd6] text-[#fffaef] shadow-[2px_2px_0_0_#161310] -translate-x-0.5 -translate-y-0.5'
                    : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#e8dfd0]'
                }`}
                onClick={() => onSourceChange?.(key as keyof typeof VIDEO_SOURCES)}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {episodes.map((episode, index) => (
            <Link
              key={episode}
              to={`/play/${id}/${episode}/${currentSource}`}
              className={`py-2 px-1 text-center border-2 border-[#161310] transition-all font-mono text-sm font-bold ${
                episode === currentEpisode 
                  ? 'bg-[#2e5dd6] text-[#fffaef] shadow-[2px_2px_0_0_#161310] -translate-x-0.5 -translate-y-0.5' 
                  : 'bg-[#fffaef] text-[#161310] hover:bg-[#f5f0e8]'
              }`}
            >
              {episodeNames[index] || `第${episode.toString().padStart(2, '0')}集`}
            </Link>
          ))}
        </div>
      </div>

      {/* Related recommendations */}
      {/*<div className="bg-white rounded-lg p-6">*/}
      {/*  <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">相关推荐</h2>*/}

      {/*  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">*/}
      {/*    /!* We would map through related items here *!/*/}
      {/*    {[1, 2, 3, 4, 5, 6].map((item) => (*/}
      {/*      <div key={item} className="content-card relative bg-white rounded-md overflow-hidden shadow-sm">*/}
      {/*        <div className="relative pb-[140%]">*/}
      {/*          <img*/}
      {/*            src={`https://ext.same-assets.com/2490417499/${3930992340 - item * 500000}.jpeg`}*/}
      {/*            alt="Related content"*/}
      {/*            className="absolute inset-0 w-full h-full object-cover"*/}
      {/*          />*/}

      {/*          /!* Rating badge *!/*/}
      {/*          <div className="absolute top-1 left-1 rating-badge">*/}
      {/*            {(Math.random() * 2 + 7).toFixed(1)}*/}
      {/*          </div>*/}

      {/*          /!* Episode count *!/*/}
      {/*          <div className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">*/}
      {/*            更新至{Math.floor(Math.random() * 20 + 1)}集*/}
      {/*          </div>*/}

      {/*          /!* Play button overlay *!/*/}
      {/*          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-40">*/}
      {/*            <div className="play-icon p-2 rounded-full bg-white bg-opacity-80">*/}
      {/*              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
      {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />*/}
      {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />*/}
      {/*              </svg>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        <div className="p-2">*/}
      {/*          <h3 className="text-sm font-medium line-clamp-1">*/}
      {/*            相关推荐视频 {item}*/}
      {/*          </h3>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default VideoDetail;
