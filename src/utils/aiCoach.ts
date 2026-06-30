import type { AICoachAnalysis, DailyRecord } from '../types';

/**
 * AI 教练分析引擎 (规则驱动，离线可用)
 * 核心理念：避免焦虑，科学解释体重波动
 */
export function analyzeWeight(
  todayWeight: number,
  yesterdayWeight: number | null,
  records: DailyRecord[],
  isWorkoutDay: boolean,
  yesterdayWorkout: boolean,
  sleepHours: number | undefined,
  saltIntake: string | undefined
): AICoachAnalysis {
  const change = yesterdayWeight !== null ? +(todayWeight - yesterdayWeight).toFixed(1) : 0;
  const absChange = Math.abs(change);
  const trend = getTrend(records);

  let fluctuationType: AICoachAnalysis['fluctuationType'] = 'normal';
  let analysis = '';
  let suggestion = '';
  let shouldAdjustDiet = false;
  let shouldAdjustCardio = false;

  if (change <= -0.3) {
    // 体重下降
    if (change <= -1.0) {
      fluctuationType = 'loss';
      analysis = `🔥 今天比昨天下降 ${absChange} 斤，速度较快。`;
      suggestion = '下降速度偏快，注意保持蛋白质摄入，避免肌肉流失。不要因为掉秤快就进一步少吃——肌肉才是燃脂引擎。';
    } else {
      fluctuationType = 'loss';
      analysis = `✅ 今天比昨天下降 ${absChange} 斤，属于健康的减脂速度。`;
      suggestion = '继续保持当前饮食和训练节奏，你做得很棒！稳定的下降 > 骤降。';
    }
  } else if (change >= 0.3) {
    // 体重上涨
    if (yesterdayWorkout && absChange <= 1.0) {
      fluctuationType = 'recovery';
      analysis = `📈 今天比昨天上涨 ${change} 斤。但昨天你做了力量训练，这是正常的——肌肉在修复时会储水，这叫「训练后炎症反应」，不是长胖。`;
      suggestion = '完全不用担心！24-48小时后水分会自然排出。继续按照计划执行，不要减少饮食——肌肉修复需要营养。';
    } else if (saltIntake === 'high') {
      fluctuationType = 'salt';
      analysis = `📈 今天上涨 ${change} 斤。很可能是钠摄入偏多导致的水钠潴留，1g盐会让你多储存约80ml水。`;
      suggestion = '今天多喝水帮助排钠，明天体重就会回落。不是脂肪，不用焦虑。';
    } else if (sleepHours !== undefined && sleepHours < 6) {
      fluctuationType = 'sleep';
      analysis = `📈 今天上涨 ${change} 斤。你最近睡眠不足（<6小时），这会导致皮质醇升高，身体更容易储水且更难燃脂。`;
      suggestion = '优先保证睡眠！睡眠是最好的减脂补剂。今晚争取11点前上床，连续三天好睡眠，体重会自然回落。';
    } else if (absChange < 0.6 && trend === 'plateau') {
      fluctuationType = 'plateau';
      analysis = `📊 最近体重在 ±1斤内波动，可能进入了平台期。这是身体在适应新的体重设定点，非常正常。`;
      suggestion = '建议保持当前计划再观察1周。如果持续不降，可以考虑调整碳水循环或增加每天2000步步行。千万不要大幅削减热量——那只会让代谢更慢。';
    } else {
      fluctuationType = 'water';
      analysis = `📈 今天上涨 ${change} 斤。一天之内涨这么多几乎不可能是脂肪（1斤脂肪=3850大卡，你不可能多吃那么多）。这大概率是水分波动。`;
      suggestion = '水分波动很正常——可能是碳水摄入、激素水平、天气变化都有关。保持冷静，按计划执行，明后天再看趋势。';
    }
  } else {
    // 基本不变
    analysis = `📊 今天体重与昨天基本持平。身体正在适应，这是好现象。`;
    suggestion = '如果连续3-5天不变，可以考虑增加一点有氧或减少50g碳水。但目前不需要调整，继续执行即可。';
  }

  // 长期趋势提示
  if (trend === 'down' && change < 0) {
    suggestion += '\n\n📉 近7天趋势：持续下降中，速度很好！';
  } else if (trend === 'up' && change >= 0) {
    suggestion += '\n\n⚠️ 近7天整体呈上涨趋势，建议回顾一下饮食和训练执行情况。';
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    weightChange: change,
    analysis,
    suggestion,
    fluctuationType,
    shouldAdjustDiet,
    shouldAdjustCardio,
  };
}

function getTrend(records: DailyRecord[]): 'down' | 'up' | 'plateau' | 'unknown' {
  const sorted = [...records].filter(r => r.weight > 0).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  if (sorted.length < 3) return 'unknown';
  const first = sorted[sorted.length - 1].weight;
  const last = sorted[0].weight;
  const diff = last - first;
  if (diff < -0.5) return 'down';
  if (diff > 0.5) return 'up';
  return 'plateau';
}

/** 生成每日鼓励语 */
export function dailyMotivation(streak: number, remaining: number): string {
  if (streak === 0) return '今天是新的开始，140斤的目标从这一刻启动！🔥';
  if (streak === 1) return '第一天完成！好的开始是成功的一半 💪';
  if (streak < 7) return `连续 ${streak} 天！你正在建立习惯 🔥`;
  if (streak < 30) return `连续 ${streak} 天！习惯已经形成，继续冲刺 🚀`;
  if (streak < 60) return `连续 ${streak} 天！你已经超越了大多数人 🏅`;
  return `连续 ${streak} 天！你是自律的化身 👑`;
}
