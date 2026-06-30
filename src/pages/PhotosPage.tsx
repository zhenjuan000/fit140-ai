import React, { useState, useRef } from 'react';
import { useApp, todayStr } from '../store/AppContext';
import type { PhotoRecord } from '../types';

type PoseType = 'front' | 'side' | 'back';

export default function PhotosPage() {
  const { state, dispatch } = useApp();
  const today = todayStr();
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentPose, setCurrentPose] = useState<PoseType>('front');
  const [preview, setPreview] = useState<string | null>(null);

  const sortedPhotos = Object.values(state.photos).sort((a, b) => b.date.localeCompare(a.date));
  const todayPhotos = state.photos[today];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setPreview(data);
      dispatch({ type: 'SAVE_PHOTO', date: today, pose: currentPose, data });
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const triggerUpload = (pose: PoseType) => {
    setCurrentPose(pose);
    fileRef.current?.click();
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📷 身材记录</h2>
        <span className="text-white/30 text-xs">每周拍照对比</span>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 今天拍照 */}
      <div className="glass-strong p-5 space-y-4">
        <p className="text-sm font-semibold text-white/60">📸 今天拍照</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { pose: 'front' as PoseType, label: '正面', icon: '🧍' },
            { pose: 'side' as PoseType, label: '侧面', icon: '🚶' },
            { pose: 'back' as PoseType, label: '背面', icon: '🧍‍♂️' },
          ]).map(({ pose, label, icon }) => {
            const hasPhoto = todayPhotos?.[pose];
            return (
              <button
                key={pose}
                onClick={() => triggerUpload(pose)}
                className={`glass p-3 rounded-xl tap-active text-center space-y-2 transition-all ${
                  hasPhoto ? 'border-brand-primary/30' : ''
                }`}
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-xs text-white/60">{label}</p>
                {hasPhoto ? (
                  <span className="text-brand-primary text-xs">✅ 已拍</span>
                ) : (
                  <span className="text-white/20 text-xs">点击拍照</span>
                )}
              </button>
            );
          })}
        </div>
        {preview && (
          <div className="mt-3 animate-fade-in">
            <p className="text-xs text-brand-primary mb-2">✅ 已保存 {currentPose === 'front' ? '正面' : currentPose === 'side' ? '侧面' : '背面'}照</p>
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
          </div>
        )}
      </div>

      {/* 历史记录 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/50 px-1">📅 历史记录</h3>
        {sortedPhotos.length === 0 ? (
          <div className="glass p-8 text-center">
            <p className="text-white/30 text-sm">还没有拍照记录</p>
            <p className="text-white/20 text-xs mt-1">每周拍一次正面、侧面、背面，100天后变化会非常明显</p>
          </div>
        ) : (
          sortedPhotos.map((photo) => (
            <PhotoCard key={photo.date} photo={photo} />
          ))
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}

function PhotoCard({ photo }: { photo: PhotoRecord }) {
  const d = new Date(photo.date);
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return (
    <div className="glass p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white/70">
          {d.getMonth() + 1}月{d.getDate()}日 周{weekDay}
        </p>
        <span className="text-white/20 text-xs">
          {[photo.front, photo.side, photo.back].filter(Boolean).length}/3 张
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(['front', 'side', 'back'] as const).map((pose) => (
          <div key={pose} className="aspect-[3/4] bg-white/3 rounded-lg overflow-hidden flex items-center justify-center">
            {photo[pose] ? (
              <img src={photo[pose]} alt={pose} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/15 text-xs">
                {pose === 'front' ? '正面' : pose === 'side' ? '侧面' : '背面'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
