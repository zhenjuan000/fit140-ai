import React from 'react';
import { useApp, todayStr } from '../store/AppContext';
import { ALL_MEAL_ITEMS } from '../data/meals';
import type { MealItem } from '../types';

export default function DietPage() {
  const { dispatch, todayRecord } = useApp();
  const today = todayStr();

  const toggleMeal = (mealType: string, itemId: string) => {
    dispatch({ type: 'TOGGLE_MEAL', date: today, mealType, itemId });
  };

  // 计算所有已选食物的营养总和
  const allSelectedIds = Object.values(todayRecord.meals).flat();
  const allItems = Object.values(ALL_MEAL_ITEMS).flat();
  const itemMap = new Map<string, MealItem>();
  allItems.forEach((i) => itemMap.set(i.id, i));

  const totals = allSelectedIds.reduce(
    (acc, id) => {
      const item = itemMap.get(id);
      if (item) {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.fat += item.fat;
        acc.carbs += item.carbs;
      }
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const mealConfigs = [
    { key: 'breakfast', label: '早餐', icon: '🌅', items: ALL_MEAL_ITEMS.breakfast },
    { key: 'lunch', label: '午餐', icon: '🌞', items: ALL_MEAL_ITEMS.lunch },
    { key: 'dinner', label: '晚餐', icon: '🌙', items: ALL_MEAL_ITEMS.dinner },
    { key: 'snack', label: '加餐', icon: '🍎', items: ALL_MEAL_ITEMS.snack },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🍽 饮食记录</h2>
        <span className="text-white/30 text-sm">{today}</span>
      </div>

      {/* ===== 营养汇总 ===== */}
      <div className="glass-strong p-4">
        <p className="text-white/40 text-xs mb-3">今日摄入汇总</p>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: '热量', value: totals.calories, unit: 'kcal', color: 'text-orange-400' },
            { label: '蛋白质', value: totals.protein, unit: 'g', color: 'text-red-400' },
            { label: '脂肪', value: totals.fat, unit: 'g', color: 'text-yellow-400' },
            { label: '碳水', value: totals.carbs, unit: 'g', color: 'text-blue-400' },
          ].map((n) => (
            <div key={n.label}>
              <p className={`text-2xl font-bold ${n.color}`}>{n.value}</p>
              <p className="text-white/30 text-xs">{n.label}<span className="text-white/15">/{n.unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 各餐 ===== */}
      {mealConfigs.map((meal) => {
        const selected = todayRecord.meals[meal.key] || [];
        const mealCalories = selected.reduce((sum, id) => {
          const item = itemMap.get(id);
          return sum + (item?.calories || 0);
        }, 0);
        return (
          <div key={meal.key} className="glass p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{meal.icon}</span>
                <span className="font-semibold text-sm">{meal.label}</span>
              </div>
              <span className="text-xs text-white/30">{mealCalories} kcal</span>
            </div>
            <div className="space-y-2">
              {meal.items.map((item) => {
                const isChecked = selected.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleMeal(meal.key, item.id)}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/3 tap-active transition-all"
                  >
                    <div className={`check-circle ${isChecked ? 'checked' : ''}`} />
                    <span className="text-[28px]">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isChecked ? 'text-white/60 line-through' : 'text-white/80'}`}>
                        {item.name}
                      </p>
                      <p className="text-white/25 text-xs">
                        {item.calories}kcal · 蛋白{item.protein}g · 脂肪{item.fat}g · 碳水{item.carbs}g
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="h-4" />
    </div>
  );
}
