import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: '📊', label: '首页' },
  { path: '/diet', icon: '🍽', label: '饮食' },
  { path: '/workout', icon: '💪', label: '训练' },
  { path: '/stats', icon: '📈', label: '统计' },
  { path: '/ai', icon: '🤖', label: 'AI教练' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <nav className="nav-glass fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto rounded-t-2xl">
      <div className="flex items-center justify-around px-2 py-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all tap-active min-w-[56px] ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-medium">{item.label}</span>
              {isActive && <div className="w-4 h-0.5 bg-brand-primary rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
