import React, { useState, useMemo } from 'react';
import { useApp, todayStr } from '../store/AppContext';
import { analyzeWeight, dailyMotivation } from '../utils/aiCoach';
import { getTodayWorkout, WEEKDAY_NAMES } from '../data/workouts';
import { calcStreak } from '../utils/calculations';
import { daysRemaining } from '../utils/dateUtils';

export default function AICoachPage() {
  const { state, dispatch, todayRecord } = useApp();
  const today = todayStr();
  const [sleepInput, setSleepInput] = useState(todayRecord.sleepHours?.toString() || '');
  const [saltLevel, setSaltLevel] = useState<'low' | 'normal' | 'high'>(todayRecord.saltIntake || 'normal');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const streak = calcStreak(state.records);
  const remaining = daysRemaining(state.userProfile.targetDate);
  const dayOfWeek = new Date().getDay();
  const workout = getTodayWorkout();
  const motivation = dailyMotivation(streak, remaining);

  // 获取昨天和前天的记录
  const yesterday = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return state.records[d.toISOString().slice(0, 10)];
  }, [state.records]);

  const yesterdayWorkout = (() => {
    if (!yesterday) return false;
    const wKeys = Object.keys(yesterday.workouts);
    return wKeys.some((k) => yesterday.workouts[k]) || yesterday.cardioCompleted;
  })();

  // 获取最近记录用于趋势分析
  const recentRecords = useMemo(() => {
    return Object.values(state.records)
      .filter((r) => r.weight > 0)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14);
  }, [state.records]);

  // AI 分析结果
  const analysis = useMemo(() => {
    if (!todayRecord.weight || todayRecord.weight <= 0) return null;
    return analyzeWeight(
      todayRecord.weight,
      yesterday?.weight || null,
      recentRecords,
      workout.id !== 'sun_rest',
      yesterdayWorkout,
      todayRecord.sleepHours,
      todayRecord.saltIntake
    );
  }, [todayRecord.weight, yesterday, recentRecords, workout, yesterdayWorkout, todayRecord.sleepHours, todayRecord.saltIntake]);

  const handleSaveSleep = () => {
    const h = parseFloat(sleepInput);
    if (h > 0 && h <= 24) {
      dispatch({ type: 'SET_SLEEP', date: today, hours: h });
    }
  };

  const handleSetSalt = (level: 'low' | 'normal' | 'high') => {
    setSaltLevel(level);
    dispatch({ type: 'SET_SALT', date: today, level });
  };

  const handleRefreshAnalysis = () => {
    setShowAnalysis(true);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🤖 AI 教练</h2>
        <span className="text-white/30 text-xs">防焦虑模式</span>
      </div>

      {/* 鼓励语 */}
      <div className="glass-strong p-5 text-center space-y-2">
        <span className="text-4xl">🧠</span>
        <p className="text-lg font-semibold">{motivation}</p>
        <p className="text-white/30 text-sm">
          目标：{state.userProfile.targetDate} 达到 {state.userProfile.targetWeight} 斤 · 还剩 {remaining} 天
        </p>
      </div>

      {/* 今日数据输入 */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">📋 今日状态输入</h3>

        {/* 体重 */}
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">今日体重</span>
          <span className="text-lg font-bold">
            {todayRecord.weight > 0 ? `${todayRecord.weight.toFixed(1)} 斤` : '未记录'}
          </span>
        </div>

        {/* 睡眠 */}
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm w-16">😴 睡眠</span>
          <input
            type="number"
            value={sleepInput}
            onChange={(e) => setSleepInput(e.target.value)}
            placeholder="小时"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-info"
            step="0.5"
          />
          <button
            onClick={handleSaveSleep}
            className="bg-brand-info/20 text-brand-info px-3 py-2 rounded-lg text-sm tap-active"
          >
            保存
          </button>
        </div>

        {/* 盐分摄入 */}
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm w-16">🧂 盐分</span>
          <div className="flex gap-2">
            {(['low', 'normal', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => handleSetSalt(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tap-active transition-all ${
                  saltLevel === level
                    ? 'bg-white/15 text-white'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {level === 'low' ? '低盐' : level === 'normal' ? '正常' : '高盐'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI 分析按钮 */}
      {todayRecord.weight > 0 && (
        <button
          onClick={handleRefreshAnalysis}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-2xl tap-active"
        >
          🧠 AI 分析今日体重
        </button>
      )}

      {/* AI 分析结果 */}
      {showAnalysis && analysis && (
        <div className="space-y-3 animate-fade-in">
          {/* 波动类型 */}
          <div className="glass-strong p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-3xl ${
                analysis.fluctuationType === 'loss' ? '' :
                analysis.fluctuationType === 'normal' ? '' : ''
              }`}>
                {analysis.fluctuationType === 'loss' ? '✅' :
                 analysis.fluctuationType === 'plateau' ? '📊' :
                 analysis.fluctuationType === 'recovery' ? '💪' : '🔍'}
              </span>
              <div>
                <p className="font-bold text-white">
                  {analysis.fluctuationType === 'loss' ? '体重下降' :
                   analysis.fluctuationType === 'recovery' ? '训练恢复' :
                   analysis.fluctuationType === 'salt' ? '钠摄入偏高' :
                   analysis.fluctuationType === 'sleep' ? '睡眠不足' :
                   analysis.fluctuationType === 'plateau' ? '平台期' : '正常波动'}
                </p>
                <p className="text-white/30 text-xs">
                  变化：{analysis.weightChange > 0 ? '+' : ''}{analysis.weightChange} 斤
                </p>
              </div>
            </div>

            <div className="bg-white/3 rounded-xl p-4">
              <p className="text-white/80 text-sm leading-relaxed">{analysis.analysis}</p>
            </div>

            <div className="bg-brand-primary/8 border border-brand-primary/15 rounded-xl p-4">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{analysis.suggestion}</p>
            </div>

            {analysis.shouldAdjustDiet && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                <p className="text-orange-300 text-xs">⚠️ 建议微调饮食方案</p>
              </div>
            )}
            {analysis.shouldAdjustCardio && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                <p className="text-blue-300 text-xs">🏃 建议调整有氧运动量</p>
              </div>
            )}
          </div>

          {/* 小贴士 */}
          <div className="glass p-4 space-y-2">
            <h4 className="text-sm font-semibold text-white/50">💡 今日小贴士</h4>
            <ul className="text-white/40 text-xs space-y-1.5">
              <li>• 1斤脂肪 ≈ 3850大卡热量缺口</li>
              <li>• 每天称体重尽量同一时间（建议早起空腹）</li>
              <li>• 力量训练后肌肉储水是正常现象，1-2天后消退</li>
              <li>• 1g盐会让你多储存约80ml水</li>
              <li>• 睡眠不足→皮质醇升高→更容易储水</li>
            </ul>
          </div>
        </div>
      )}

      {!showAnalysis && !todayRecord.weight && (
        <div className="glass p-8 text-center space-y-3">
          <span className="text-5xl">🤖</span>
          <p className="text-white/40 text-sm">先在首页记录今天的体重，AI教练就能帮你分析了</p>
          <p className="text-white/25 text-xs">我会告诉你今天的体重波动是正常还是异常，帮你避免不必要的焦虑</p>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
