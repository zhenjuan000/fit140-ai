import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-[100dvh] flex flex-col max-w-lg mx-auto relative">
      {/* 背景光晕 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/5 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-green-400/5 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 left-1/3 w-56 h-56 bg-emerald-500/5 rounded-full blur-[80px]" />
      </div>

      {/* 内容区 */}
      <main className="flex-1 px-4 pt-4 pb-28 relative z-10 overflow-y-auto">
        <Outlet />
      </main>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
