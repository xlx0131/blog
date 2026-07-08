import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  HiHome, 
  HiFilm, 
  HiDesktopComputer, 
  HiSparkles, 
  HiStar,
  HiVideoCamera
} from 'react-icons/hi';
import { HiCog6Tooth } from 'react-icons/hi2';
import Logo from './Logo';

const Sidebar = () => {
  const location = useLocation();
  
  // Menu items based on the website
  const menuItems = [
    { id: 1, name: '首页', icon: HiHome, link: '/' },
    { id: 2, name: '电影', icon: HiFilm, link: '/movies' },
    { id: 5, name: '综艺', icon: HiStar, link: '/variety' },
    { id: 3, name: '电视剧', icon: HiDesktopComputer, link: '/tv' },
    { id: 4, name: '动漫', icon: HiSparkles, link: '/anime' },
    { id: 6, name: '短剧', icon: HiVideoCamera, link: '/short' },
  ];

  return (
    <div className="sidebar-nav h-screen w-[220px] fixed left-0 top-0 p-5 flex flex-col bg-[#fffaef] border-r-2 border-[#161310]">
      <div className="mb-8">
        <Logo />
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;
            return (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 px-4 py-3 text-[#161310] transition-all duration-200 border-2 ${
                    isActive 
                      ? 'bg-[#2e5dd6] text-[#fffaef] border-[#161310] shadow-[3px_3px_0_0_#161310] -translate-x-0.5 -translate-y-0.5' 
                      : 'border-transparent hover:border-[#161310] hover:bg-[#f5f0e8] hover:shadow-[2px_2px_0_0_#161310]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#fffaef]' : 'text-[#161310]'}`} />
                  <span className="font-bold text-sm tracking-wide">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/*<div className="mt-auto pt-4 border-t border-gray-100">*/}
      {/*  <a*/}
      {/*    href="/settings"*/}
      {/*    className={`flex items-center gap-3 px-4 py-2.5 text-gray-600 rounded-lg transition-all duration-200 ${*/}
      {/*      location.pathname === '/settings' */}
      {/*        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 shadow-sm' */}
      {/*        : 'hover:bg-gray-50 hover:text-gray-900'*/}
      {/*    }`}*/}
      {/*  >*/}
      {/*    <HiCog6Tooth className={`w-5 h-5 ${location.pathname === '/settings' ? 'text-red-500' : 'text-gray-400'}`} />*/}
      {/*    <span className="font-medium">设置</span>*/}
      {/*  </a>*/}
      {/*</div>*/}
    </div>
  );
};

export default Sidebar;
