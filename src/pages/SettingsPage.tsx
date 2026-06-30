import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { userProfile, settings } = state;

  const handleReset = () => {
    if (window.confirm('确定要重置所有数据吗？此操作不可撤销！')) {
      dispatch({ type: 'RESET_ALL' });
      window.location.href = '/';
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fit140-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (data.userProfile && data.records) {
            localStorage.setItem('fit140_state', JSON.stringify(data));
            window.location.reload();
          }
        } catch {
          alert('无效的备份文件');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold">⚙️ 设置</h2>

      {/* 个人信息 */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">👤 个人信息</h3>
        {[
          { label: '起始体重', value: `${userProfile.startWeight} 斤`, key: 'startWeight' },
          { label: '目标体重', value: `${userProfile.targetWeight} 斤`, key: 'targetWeight' },
          { label: '目标日期', value: userProfile.targetDate, key: 'targetDate' },
          { label: '身高', value: `${userProfile.height} cm`, key: 'height' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-1">
            <span className="text-white/50 text-sm">{label}</span>
            <span className="text-white/80 text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* 提醒设置 */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">🔔 提醒 (V2.0)</h3>
        <p className="text-white/25 text-xs">每日提醒功能将在后续版本中上线，敬请期待。</p>
        <div className="opacity-40">
          {['⏰ 上午 8:00 - 称体重', '💪 下午 4:00 - 今日训练', '💧 晚上 9:00 - 喝水检查'].map((r) => (
            <div key={r} className="flex items-center gap-3 py-2">
              <span className="text-sm text-white/50">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 数据管理 */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">💾 数据管理</h3>
        <div className="space-y-2">
          <button onClick={handleExport} className="w-full py-3 bg-brand-info/15 text-brand-info rounded-xl text-sm font-semibold tap-active">
            📤 导出数据备份
          </button>
          <button onClick={handleImport} className="w-full py-3 bg-white/5 text-white/60 rounded-xl text-sm font-semibold tap-active">
            📥 导入数据恢复
          </button>
          <button onClick={handleReset} className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-semibold tap-active">
            🗑 重置所有数据
          </button>
        </div>
      </div>

      {/* 关于 */}
      <div className="glass p-4 space-y-2 text-center">
        <p className="text-lg font-bold text-gradient">Fit140 AI</p>
        <p className="text-white/25 text-xs">V1.0 · 你的专属减脂教练</p>
        <p className="text-white/15 text-xs">目标：2026.10.15 → 140斤 🔥</p>
        <p className="text-white/15 text-xs pt-2">Built with ❤️ · PWA Ready</p>
      </div>

      <div className="h-4" />
    </div>
  );
}
