import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useApp } from '../store/AppContext';
import { calcBMI } from '../utils/calculations';
import { lastNDates, formatDate, daysRemaining } from '../utils/dateUtils';

export default function StatsPage() {
  const { state } = useApp();
  const { userProfile, records } = state;

  // 准备图表数据（最近30天）
  const dates = lastNDates(30);
  const chartData = dates
    .filter((d) => records[d] && records[d].weight > 0)
    .map((d) => ({
      date: formatDate(d),
      weight: records[d].weight,
      bmi: calcBMI(records[d].weight, userProfile.height),
    }));

  const sortedRecords = Object.values(records)
    .filter((r) => r.weight > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  // 每周平均速度
  const weeklyRate = (() => {
    if (sortedRecords.length < 7) return null;
    const recent = sortedRecords.slice(0, 7);
    const loss = recent[recent.length - 1].weight - recent[0].weight;
    return (-loss).toFixed(1);
  })();

  // 本周 vs 上周
  const thisWeek = (() => {
    if (sortedRecords.length < 14) return null;
    const w1 = sortedRecords.slice(0, 7);
    const w2 = sortedRecords.slice(7, 14);
    const avg1 = w1.reduce((s, r) => s + r.weight, 0) / w1.length;
    const avg2 = w2.reduce((s, r) => s + r.weight, 0) / w2.length;
    return (avg2 - avg1).toFixed(1);
  })();

  // 总减重
  const totalLoss = userProfile.startWeight - userProfile.currentWeight;

  // 预计完成日期
  const estimateCompletion = (() => {
    if (sortedRecords.length < 5) return null;
    const recent7 = sortedRecords.slice(0, Math.min(7, sortedRecords.length));
    let totalLoss = 0;
    let count = 0;
    for (let i = 1; i < recent7.length; i++) {
      const diff = recent7[i].weight - recent7[i - 1].weight;
      if (diff > 0) { totalLoss += diff; count++; }
    }
    if (count === 0 || totalLoss / count <= 0) return null;
    const avgDaily = totalLoss / count;
    const remaining = userProfile.currentWeight - userProfile.targetWeight;
    const days = Math.round(remaining / avgDaily);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  })();

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold">📈 数据统计</h2>

      {/* ===== 关键指标 ===== */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4">
          <p className="text-white/40 text-xs">总减重</p>
          <p className="text-2xl font-bold text-brand-primary">{totalLoss.toFixed(1)}<span className="text-sm text-white/30"> 斤</span></p>
        </div>
        <div className="glass p-4">
          <p className="text-white/40 text-xs">周均速度</p>
          <p className="text-2xl font-bold text-brand-info">{weeklyRate || '--'}<span className="text-sm text-white/30"> 斤/周</span></p>
        </div>
        <div className="glass p-4">
          <p className="text-white/40 text-xs">本周 vs 上周</p>
          <p className={`text-2xl font-bold ${thisWeek && parseFloat(thisWeek) <= 0 ? 'text-green-400' : 'text-orange-400'}`}>
            {thisWeek ? `${parseFloat(thisWeek) > 0 ? '+' : ''}${thisWeek}` : '--'}
            <span className="text-sm text-white/30"> 斤</span>
          </p>
        </div>
        <div className="glass p-4">
          <p className="text-white/40 text-xs">预计达成</p>
          <p className="text-2xl font-bold text-brand-accent">
            {estimateCompletion || '--'}
          </p>
        </div>
      </div>

      {/* ===== 体重曲线 ===== */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">📉 体重曲线（30天）</h3>
        {chartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34C759" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#34C759" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} interval="preserveStartEnd" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} width={40} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,20,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="weight" stroke="#34C759" strokeWidth={2.5} fill="url(#weightGrad)" dot={{ r: 2, fill: '#34C759' }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/30 text-sm text-center py-10">记录更多体重数据后自动生成曲线</p>
        )}
      </div>

      {/* ===== BMI 曲线 ===== */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">📐 BMI 变化</h3>
        {chartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} interval="preserveStartEnd" />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} width={40} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,20,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '13px',
                }}
              />
              <Line type="monotone" dataKey="bmi" stroke="#007AFF" strokeWidth={2.5} dot={{ r: 2, fill: '#007AFF' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/30 text-sm text-center py-10">记录更多体重数据后自动生成曲线</p>
        )}
      </div>

      {/* ===== 里程碑 ===== */}
      <div className="glass p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/60">🏆 里程碑</h3>
        <div className="space-y-2">
          {[180, 175, 170, 165, 160, 155, 150, 145, 140].map((m) => {
            const achieved = userProfile.currentWeight <= m;
            const progress = userProfile.startWeight > m
              ? Math.min(100, Math.round(((userProfile.startWeight - userProfile.currentWeight) / (userProfile.startWeight - m)) * 100))
              : 100;
            return (
              <div key={m} className="flex items-center gap-3">
                <span className={`text-lg ${achieved ? 'opacity-100' : 'opacity-30'}`}>
                  {achieved ? '✅' : '🔒'}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={achieved ? 'text-white/70' : 'text-white/30'}>{m} 斤</span>
                    <span className="text-white/20">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progress}%`, opacity: achieved ? 1 : 0.4 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
