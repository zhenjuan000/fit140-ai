import type { MealItem } from '../types';

// 预设早餐食材
export const BREAKFAST_ITEMS: MealItem[] = [
  { id: 'egg', name: '鸡蛋 ×3', calories: 210, protein: 18, fat: 15, carbs: 1, icon: '🥚' },
  { id: 'milk', name: '牛奶 250ml', calories: 160, protein: 8, fat: 8, carbs: 12, icon: '🥛' },
  { id: 'coffee', name: '黑咖啡', calories: 5, protein: 0, fat: 0, carbs: 0, icon: '☕' },
  { id: 'oats', name: '燕麦 30g', calories: 114, protein: 4, fat: 2, carbs: 20, icon: '🥣' },
];

// 预设午餐食材
export const LUNCH_ITEMS: MealItem[] = [
  { id: 'chicken_breast', name: '鸡胸肉 200g', calories: 266, protein: 50, fat: 6, carbs: 0, icon: '🍗' },
  { id: 'rice', name: '米饭 150g', calories: 174, protein: 4, fat: 0, carbs: 39, icon: '🍚' },
  { id: 'broccoli', name: '西兰花 200g', calories: 68, protein: 6, fat: 0, carbs: 12, icon: '🥦' },
  { id: 'sweet_potato', name: '红薯 200g', calories: 172, protein: 2, fat: 0, carbs: 40, icon: '🍠' },
  { id: 'salmon', name: '三文鱼 150g', calories: 280, protein: 34, fat: 16, carbs: 0, icon: '🐟' },
  { id: 'tofu', name: '豆腐 200g', calories: 120, protein: 14, fat: 7, carbs: 2, icon: '🧈' },
  { id: 'beef', name: '牛肉 150g', calories: 270, protein: 40, fat: 12, carbs: 0, icon: '🥩' },
  { id: 'shrimp', name: '虾仁 150g', calories: 140, protein: 30, fat: 1, carbs: 0, icon: '🦐' },
];

// 预设晚餐食材
export const DINNER_ITEMS: MealItem[] = [
  { id: 'chicken_breast_d', name: '鸡胸肉 200g', calories: 266, protein: 50, fat: 6, carbs: 0, icon: '🍗' },
  { id: 'eggs_dinner', name: '鸡蛋 ×2', calories: 140, protein: 12, fat: 10, carbs: 1, icon: '🥚' },
  { id: 'salad', name: '蔬菜沙拉', calories: 45, protein: 2, fat: 0, carbs: 8, icon: '🥗' },
  { id: 'cucumber', name: '黄瓜 200g', calories: 30, protein: 2, fat: 0, carbs: 6, icon: '🥒' },
  { id: 'tomato', name: '番茄 ×2', calories: 40, protein: 2, fat: 0, carbs: 8, icon: '🍅' },
  { id: 'shrimp_d', name: '虾仁 150g', calories: 140, protein: 30, fat: 1, carbs: 0, icon: '🦐' },
  { id: 'mushroom', name: '蘑菇 150g', calories: 40, protein: 5, fat: 0, carbs: 3, icon: '🍄' },
];

// 加餐/零食
export const SNACK_ITEMS: MealItem[] = [
  { id: 'whey', name: '蛋白粉 1勺', calories: 120, protein: 25, fat: 2, carbs: 3, icon: '🥤' },
  { id: 'creatine', name: '肌酸 5g', calories: 0, protein: 0, fat: 0, carbs: 0, icon: '💊' },
  { id: 'apple', name: '苹果 1个', calories: 95, protein: 0, fat: 0, carbs: 25, icon: '🍎' },
  { id: 'banana', name: '香蕉 1根', calories: 105, protein: 1, fat: 0, carbs: 27, icon: '🍌' },
  { id: 'almonds', name: '杏仁 20g', calories: 116, protein: 4, fat: 10, carbs: 2, icon: '🥜' },
  { id: 'yogurt', name: '酸奶 200g', calories: 120, protein: 6, fat: 4, carbs: 16, icon: '🍶' },
];

export const ALL_MEAL_ITEMS: Record<string, MealItem[]> = {
  breakfast: BREAKFAST_ITEMS,
  lunch: LUNCH_ITEMS,
  dinner: DINNER_ITEMS,
  snack: SNACK_ITEMS,
};
