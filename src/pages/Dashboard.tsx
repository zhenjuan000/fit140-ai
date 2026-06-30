import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, todayStr } from '../store/AppContext';
import { calcBMI, bmiLevel, calcCompletion, calcStreak } from '../utils/calculations';
import { daysRemaining, formatDate } from '../utils/dateUtils';
import { getTodayWorkout, WEEKDAY_NAMES } from '../data/workouts';
import { dailyMotivation } from '../utils/aiCoach';

export default function Dashboard() {
  const { state, dispatch, todayRecord } = useApp();
  const navigate = useNavigate();
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const { userProfile, settings } = state;
  const today = todayStr();
  const remaining = daysRemaining(userProfile.targetDate);
  const bmi = calcBMI(userProfile.currentWeight, userProfile.height);
  const bmiInfo = bmiLevel(bmi);
  const streak = calcStreak(state.records);
  const completion = calcCompletion(todayRecord, settings.waterGoal);
  const workout = getTodayWorkout();
  const dayOfWeek = new Date().getDay();
  const motivation = dailyMotivation(streak, remaining);

  // 获取昨天记录
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return state.records[d.toISOString().slice(0, 10)];
  })();

  const weightDiff = yesterday?.weight && todayRecord.weight
    ? (todayRecord.weight - yesterday.weight).toFixed(1)
    : null;

  const handleSaveWeight = () => {
    const w = parseFloat(weightInput);
    if (w > 50 && w < 300) {
      dispatch({ type: 'SET_WEIGHT', date: today, weight: w });
      setShowWeightInput(false);
      setWeightInput('');
    }
  };

  const handleAddWater = () => {
    dispatch({ type: 'ADD_WATER', date: today, ml: 250 });
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* ===== 头部 ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fit140 <span className="text-gradient">AI</span></h1>
          <p className="text-white/40 text-sm mt-0.5">{motivation}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/photos')} className="glass w-10 h-10 flex items-center justify-center text-lg tap-active">
            📷
          </button>
          <button onClick={() => navigate('/settings')} className="glass w-10 h-10 flex items-center justify-center text-lg tap-active">
            ⚙️
          </button>
        </div>
      </div>

      {/* ===== 体重卡片 ===== */}
      <div className="glass-strong p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm font-medium">今日体重</span>
          <span className="text-white/30 text-xs">{formatDate(today)}</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold tracking-tighter">
              {todayRecord.weight > 0 ? todayRecord.weight.toFixed(1) : '--'}
            </span>
            <span className="text-white/30 text-lg mb-1">斤</span>
          </div>
          {weightDiff && (
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              parseFloat(weightDiff) <= 0 ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400'
            }`}>
              {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} 斤
            </span>
          )}
        </div>
        {todayRecord.weight === 0 && (
          <button
            onClick={() => setShowWeightInput(true)}
            className="w-full py-2.5 bg-brand-primary/20 text-brand-primary rounded-xl font-semibold text-sm tap-active"
          >
            ⚖️ 记录今天体重
          </button>
        )}
        {showWeightInput && (
          <div className="flex gap-2 animate-fade-in">
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="输入体重（斤）"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-center text-lg outline-none focus:border-brand-primary"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveWeight()}
            />
            <button onClick={handleSaveWeight} className="bg-brand-primary text-black px-4 py-2.5 rounded-xl font-semibold tap-active">
              确认
            </button>
          </div>
        )}
      </div>

      {/* ===== 目标指标网格 ===== */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 space-y-1">
          <span className="text-white/40 text-xs">🎯 目标</span>
          <p className="text-2xl font-bold">{userProfile.targetWeight}<span className="text-sm font-normal text-white/30"> 斤</span></p>
          <p className="text-white/30 text-xs">{userProfile.targetDate}</p>
        </div>
        <div className="glass p-4 space-y-1">
          <span className="text-white/40 text-xs">⏳ 剩余天数</span>
          <p className="text-2xl font-bold text-brand-primary">{remaining}<span className="text-sm font-normal text-white/30"> 天</span></p>
          <div className="progress-bar w-full"><div className="progress-bar-fill" style={{ width: `${Math.min(100, ((userProfile.startWeight - userProfile.currentWeight) / (userProfile.startWeight - userProfile.targetWeight)) * 100)}%` }} /></div>
        </div>
        <div className="glass p-4 space-y-1">
          <span className="text-white/40 text-xs">📐 BMI</span>
          <p className="text-2xl font-bold">{bmi > 0 ? bmi : '--'}</p>
          <p className="text-xs" style={{ color: bmiInfo.color }}>{bmiInfo.label}</p>
        </div>
        <div className="glass p-4 space-y-1">
          <span className="text-white/40 text-xs">🔥 连续打卡</span>
          <p className="text-2xl font-bold text-brand-accent">{streak}<span className="text-sm font-normal text-white/30"> 天</span></p>
          <p className="text-white/30 text-xs">{streak >= 7 ? '🏅 铜牌' : streak >= 30 ? '🥈 银牌' : streak >= 100 ? '🥇 金牌' : '坚持就是胜利'}</p>
        </div>
      </div>

      {/* ===== 完成度 ===== */}
      <div className="glass p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">今日完成度</span>
          <span className="font-bold text-brand-primary">{completion}%</span>
        </div>
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${completion}%` }} /></div>
      </div>

      {/* ===== 今日训练 ===== */}
      <div onClick={() => navigate('/workout')} className="glass p-4 tap-active space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💪</span>
            <div>
              <p className="font-semibold text-sm">今日训练 · {WEEKDAY_NAMES[dayOfWeek]}</p>
              <p className="text-white/40 text-xs">{workout.name}</p>
            </div>
          </div>
          <span className="text-white/20 text-lg">→</span>
        </div>
        {workout.exercises.slice(0, 3).map((ex) => (
          <div key={ex.id} className="flex items-center gap-2 text-sm text-white/50">
            <span className={`check-circle w-5 h-5 text-[10px] ${todayRecord.workouts[ex.id] ? 'checked' : ''}`} />
            <span>{ex.name}</span>
            <span className="text-white/20">{ex.sets}×{ex.reps}</span>
          </div>
        ))}
        <p className="text-xs text-white/25">点击查看全部 {workout.exercises.length} 个动作 →</p>
      </div>

      {/* ===== 今日饮食摘要 ===== */}
      <div onClick={() => navigate('/diet')} className="glass p-4 tap-active space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽</span>
            <p className="font-semibold text-sm">今日饮食</p>
          </div>
          <span className="text-white/20 text-lg">→</span>
        </div>
        <div className="flex gap-4 text-xs text-white/40">
          {['breakfast', 'lunch', 'dinner'].map((m) => (
            <span key={m}>
              {m === 'breakfast' ? '🌅' : m === 'lunch' ? '🌞' : '🌙'}
              {' '}{m === 'breakfast' ? '早餐' : m === 'lunch' ? '午餐' : '晚餐'}
              {' '}{todayRecord.meals[m]?.length > 0 ? '✅' : '☐'}
            </span>
          ))}
        </div>
      </div>

      {/* ===== 喝水 ===== */}
      <div className="glass p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <div>
              <p className="font-semibold text-sm">喝水</p>
              <p className="text-white/40 text-xs">目标 {settings.waterGoal / 1000}L</p>
            </div>
          </div>
          <span className="text-lg font-bold text-brand-info">
            {(todayRecord.waterMl / 1000).toFixed(1)}L
          </span>
        </div>
        <div className="progress-bar"><div className="progress-bar-fill bg-brand-info" style={{ width: `${Math.min(100, (todayRecord.waterMl / settings.waterGoal) * 100)}%` }} /></div>
        <button
          onClick={handleAddWater}
          className="w-full py-2.5 bg-brand-info/15 text-brand-info rounded-xl font-semibold text-sm tap-active"
        >
          +250ml 💧
        </button>
      </div>
    </div>
  );
}
