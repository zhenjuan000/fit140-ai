// 快捷食物数据库 —— 输入食物名，自动计算营养
export interface FoodEntry {
  name: string;
  aliases: string[];
  calories: number;   // per 100g
  protein: number;
  fat: number;
  carbs: number;
  unit: string;
}

export const FOOD_DB: FoodEntry[] = [
  { name: '鸡胸肉', aliases: ['鸡胸', '鸡大胸'], calories: 133, protein: 25, fat: 3, carbs: 0, unit: '100g' },
  { name: '鸡腿', aliases: ['鸡腿肉', '琵琶腿'], calories: 181, protein: 20, fat: 11, carbs: 0, unit: '100g' },
  { name: '牛肉（瘦）', aliases: ['牛肉', '牛瘦肉', '瘦牛肉'], calories: 125, protein: 22, fat: 4, carbs: 0, unit: '100g' },
  { name: '猪瘦肉', aliases: ['猪肉', '瘦肉', '猪里脊'], calories: 143, protein: 20, fat: 6, carbs: 0, unit: '100g' },
  { name: '三文鱼', aliases: ['三文鱼', '鲑鱼'], calories: 208, protein: 20, fat: 13, carbs: 0, unit: '100g' },
  { name: '虾仁', aliases: ['虾', '虾仁', '大虾'], calories: 93, protein: 20, fat: 1, carbs: 0, unit: '100g' },
  { name: '鸡蛋', aliases: ['鸡蛋', '蛋'], calories: 144, protein: 13, fat: 9, carbs: 1, unit: '100g（约2个）' },
  { name: '豆腐', aliases: ['豆腐', '老豆腐'], calories: 76, protein: 8, fat: 4, carbs: 2, unit: '100g' },
  { name: '米饭', aliases: ['米饭', '白米饭', '大米'], calories: 116, protein: 3, fat: 0, carbs: 26, unit: '100g' },
  { name: '红薯', aliases: ['红薯', '地瓜'], calories: 86, protein: 1, fat: 0, carbs: 20, unit: '100g' },
  { name: '燕麦', aliases: ['燕麦', '燕麦片'], calories: 377, protein: 14, fat: 7, carbs: 67, unit: '100g' },
  { name: '西兰花', aliases: ['西兰花', '西蓝花', '花椰菜'], calories: 34, protein: 3, fat: 0, carbs: 6, unit: '100g' },
  { name: '黄瓜', aliases: ['黄瓜'], calories: 15, protein: 1, fat: 0, carbs: 3, unit: '100g' },
  { name: '番茄', aliases: ['番茄', '西红柿'], calories: 20, protein: 1, fat: 0, carbs: 4, unit: '100g' },
  { name: '生菜', aliases: ['生菜'], calories: 13, protein: 1, fat: 0, carbs: 2, unit: '100g' },
  { name: '苹果', aliases: ['苹果'], calories: 52, protein: 0, fat: 0, carbs: 14, unit: '100g' },
  { name: '香蕉', aliases: ['香蕉'], calories: 91, protein: 1, fat: 0, carbs: 23, unit: '100g' },
  { name: '牛奶', aliases: ['牛奶', '纯牛奶'], calories: 66, protein: 3, fat: 4, carbs: 5, unit: '100ml' },
  { name: '酸奶', aliases: ['酸奶', '酸牛奶'], calories: 72, protein: 3, fat: 3, carbs: 10, unit: '100g' },
];

export function searchFood(query: string): FoodEntry[] {
  const q = query.toLowerCase();
  return FOOD_DB.filter((f) => f.name.includes(q) || f.aliases.some((a) => a.includes(q)));
}
