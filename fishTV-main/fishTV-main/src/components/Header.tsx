import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiSearch, HiClock, HiHome, HiX, HiTrash } from 'react-icons/hi';
import { useHistory } from '../context/HistoryContext';
import { useSearchHistory } from '../context/SearchHistoryContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showWatchHistory, setShowWatchHistory] = useState(false);
  const navigate = useNavigate();
  const { history, removeFromHistory } = useHistory();
  const { history: searchHistory, addToHistory, removeFromHistory: removeFromSearchHistory, clearHistory } = useSearchHistory();
  const timeoutRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const watchHistoryRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setShowHistory(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShowHistory(false);
    }, 200);
  };

  const handleWatchHistoryMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setShowWatchHistory(true);
  };

  const handleWatchHistoryMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShowWatchHistory(false);
    }, 200);
  };

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    addToHistory(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowHistory(false);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-[#fffaef] border-b-2 border-[#161310] sticky top-0 z-30">
      <div className="w-full px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* 手机端返回首页按钮 */}
          <Link to="/" className="home-button lg:hidden">
            <HiHome className="icon" />
          </Link>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-[700px]">
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <input
                type="text"
                placeholder="搜索电影、电视剧、动漫..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-4 border-2 border-[#161310] bg-[#fffaef] text-[#161310] focus:outline-none focus:shadow-[3px_3px_0_0_#161310] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-200 font-mono text-sm"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#161310] hover:text-[#2e5dd6] transition-colors"
              >
                <HiSearch className="w-5 h-5" />
              </button>
              
              {/* 搜索记录下拉菜单 */}
              {showHistory && searchHistory.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] max-h-96 overflow-y-auto z-50"
                >
                  <div className="p-3 border-b-2 border-[#161310] flex justify-between items-center bg-[#f5f0e8]">
                    <div className="flex items-center gap-2 text-sm text-[#161310] font-mono font-bold">
                      <HiClock className="w-4 h-4" />
                      <span>搜索历史</span>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('确定要清空所有搜索历史吗？')) {
                          clearHistory();
                        }
                      }}
                      className="text-[#161310] hover:text-[#e74c3c] transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <ul className="py-1">
                    {searchHistory.map((item, index) => (
                      <li
                        key={index}
                        className="group flex items-center justify-between px-3 py-2 hover:bg-[#f5f0e8] cursor-pointer border-b border-dashed border-[#d9cdb3] last:border-b-0"
                      >
                        <div
                          className="flex-1 flex items-center gap-2"
                          onClick={() => handleHistoryItemClick(item.query)}
                        >
                          <HiSearch className="w-4 h-4 text-[#2e5dd6]" />
                          <span className="text-sm font-mono text-[#161310]">{item.query}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromSearchHistory(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[#161310] hover:text-[#e74c3c]"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>

          {/* 导航工具按钮 */}
          <div className="flex items-center gap-2">
            {/* 历史记录按钮 */}
            <div className="relative" onMouseEnter={handleWatchHistoryMouseEnter} onMouseLeave={handleWatchHistoryMouseLeave}>
              <Link
                to="/history"
                className="history-button"
              >
                <HiClock className="w-5 h-5" />
                <span className="hidden sm:inline text">历史</span>
              </Link>

              {/* 观看历史下拉菜单 */}
              {showWatchHistory && history.length > 0 && (
                <div
                  ref={watchHistoryRef}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] z-50"
                >
                  <div className="p-2">
                    {history.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-[#f5f0e8] group border-b border-dashed border-[#d9cdb3] last:border-b-0">
                        <Link
                          to={`/play/${item.id}/${item.episode || '1'}/${item.source || 'feifan'}`}
                          className="flex-1 flex items-center space-x-3 min-w-0"
                          onClick={() => setShowWatchHistory(false)}
                        >
                          <div className="w-16 h-9 border-2 border-[#161310] overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono font-bold text-[#161310] truncate">{item.title}</p>
                            {item.episode && (
                              <p className="text-xs text-[#3a332a] font-mono">看到第 {item.episode} 集</p>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[#161310] hover:text-[#e74c3c]"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
