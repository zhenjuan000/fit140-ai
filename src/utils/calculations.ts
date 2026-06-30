/** BMI 计算 (体重斤, 身高cm) */
export function calcBMI(weightJin: number, heightCm: number): number {
  const kg = weightJin / 2;
  const m = heightCm / 100;
  return +(kg / (m * m)).toFixed(1);
}

/** BMI 等级 */
export function bmiLevel(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: '偏瘦', color: '#FF9500' };
  if (bmi < 24) return { label: '正常', color: '#34C759' };
  if (bmi < 28) return { label: '偏胖', color: '#FF9500' };
  return { label: '肥胖', color: '#FF3B30' };
}

/** 预计完成日期（基于最近7天平均速度） */
export function predictDate(
  currentWeight: number,
  targetWeight: number,
  records: { date: string; weight: number }[]
): string {
  if (records.length < 3) return '数据不足';
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const recent = sorted.slice(0, Math.min(7, sorted.length));
  if (recent.length < 2) return '数据不足';

  // 计算平均每天减重
  let totalLoss = 0;
  let totalDays = 0;
  for (let i = 1; i < recent.length; i++) {
    const loss = recent[i].weight - recent[i - 1].weight; // 前一天 - 后一天
    if (loss > 0) { totalLoss += loss; totalDays++; }
  }
  if (totalDays === 0 || totalLoss / totalDays <= 0) return '需持续减重';

  const avgDaily = totalLoss / totalDays;
  const remaining = currentWeight - targetWeight;
  if (remaining <= 0) return '已达成!';
  const days = Math.round(remaining / avgDaily);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 计算每日完成率 */
export function calcCompletion(record: {
  meals: Record<string, string[]>;
  waterMl: number;
  workouts: Record<string, boolean>;
  cardioCompleted: boolean;
}, waterGoal: number): number {
  let total = 0;
  let done = 0;

  // 饮食（三餐 + 加餐）
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  mealTypes.forEach((m) => {
    total += 1;
    if (record.meals[m] && record.meals[m].length > 0) done += 1;
  });

  // 喝水
  total += 1;
  if (record.waterMl >= waterGoal) done += 1;

  // 训练
  const wKeys = Object.keys(record.workouts);
  if (wKeys.length > 0) {
    wKeys.forEach((k) => { total += 1; if (record.workouts[k]) done += 1; });
  }

  // 有氧
  total += 1;
  if (record.cardioCompleted) done += 1;

  return total > 0 ? Math.round((done / total) * 100) : 0;
}

/** 计算连续打卡天数 */
export function calcStreak(records: Record<string, { weight?: number }>): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (records[key] && records[key].weight && records[key].weight! > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** 计算饮食总热量/营养素 */
export function calcMealNutrition(
  mealIds: string[],
  itemsMap: Record<string, { calories: number; protein: number; fat: number; carbs: number }>
) {
  return mealIds.reduce(
    (acc, id) => {
      const item = itemsMap[id];
      if (!item) return acc;
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.fat += item.fat;
      acc.carbs += item.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

/** 计算训练消耗（估算） */
export function calcWorkoutCalories(workoutName: string, durationMin: number, weightKg: number): number {
  // MET 值估算
  const metMap: Record<string, number> = {
    '胸': 6, '背': 6, '腿': 8, '肩': 5, '核心': 4, '休息': 2,
    '爬坡': 7, '跑步': 8,
  };
  let met = 5;
  Object.entries(metMap).forEach(([k, v]) => { if (workoutName.includes(k)) met = v; });
  return Math.round(met * weightKg * (durationMin / 60));
}
