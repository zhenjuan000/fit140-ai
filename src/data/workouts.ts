import type { WorkoutPlan } from '../types';

export const WEEKLY_PLAN: Record<number, WorkoutPlan> = {
  1: { // 周一：胸 + 三头
    id: 'mon_chest_tri',
    name: '胸 + 三头',
    exercises: [
      { id: 'bench_press', name: '卧推', gifUrl: '', notes: '核心收紧，肩胛骨后缩，杠铃下放至胸前', sets: 4, reps: '10次', restTime: 90, bodyPart: '胸' },
      { id: 'incline_press', name: '上斜卧推', gifUrl: '', notes: '凳子调至30-45度，重点刺激上胸', sets: 4, reps: '10次', restTime: 90, bodyPart: '上胸' },
      { id: 'flyes', name: '哑铃飞鸟', gifUrl: '', notes: '手臂微弯，感受胸部拉伸和收缩', sets: 4, reps: '12次', restTime: 60, bodyPart: '胸' },
      { id: 'cable_pushdown', name: '绳索下压', gifUrl: '', notes: '肘部固定不动，只用三头发力', sets: 4, reps: '12次', restTime: 60, bodyPart: '三头' },
      { id: 'dips', name: '双杠臂屈伸', gifUrl: '', notes: '身体前倾刺激胸部，身体直立刺激三头', sets: 3, reps: '力竭', restTime: 90, bodyPart: '三头' },
    ],
    cardio: { type: '爬坡', duration: 30 },
  },
  2: { // 周二：背 + 二头
    id: 'tue_back_bi',
    name: '背 + 二头',
    exercises: [
      { id: 'pull_up', name: '引体向上', gifUrl: '', notes: '正握宽距，收紧背部', sets: 4, reps: '力竭', restTime: 90, bodyPart: '背' },
      { id: 'barbell_row', name: '杠铃划船', gifUrl: '', notes: '腰背挺直，杠铃拉向腹部', sets: 4, reps: '10次', restTime: 90, bodyPart: '背' },
      { id: 'lat_pulldown', name: '高位下拉', gifUrl: '', notes: '握距1.5倍肩宽，拉到锁骨位置', sets: 4, reps: '12次', restTime: 60, bodyPart: '背' },
      { id: 'seated_row', name: '坐姿划船', gifUrl: '', notes: 'V字把手拉向腹部，挤压背部', sets: 4, reps: '12次', restTime: 60, bodyPart: '背' },
      { id: 'barbell_curl', name: '杠铃弯举', gifUrl: '', notes: '大臂固定，只有前臂移动', sets: 4, reps: '12次', restTime: 60, bodyPart: '二头' },
      { id: 'hammer_curl', name: '锤式弯举', gifUrl: '', notes: '掌心相对握哑铃，刺激肱肌', sets: 3, reps: '12次', restTime: 60, bodyPart: '二头' },
    ],
    cardio: { type: '爬坡', duration: 30 },
  },
  3: { // 周三：腿
    id: 'wed_legs',
    name: '腿',
    exercises: [
      { id: 'squat', name: '深蹲', gifUrl: '', notes: '脚与肩同宽，膝盖朝脚尖方向，下蹲至大腿平行地面', sets: 4, reps: '10次', restTime: 120, bodyPart: '腿' },
      { id: 'romanian_dl', name: '罗马尼亚硬拉', gifUrl: '', notes: '膝盖微弯，髋部后移，感受大腿后侧拉伸', sets: 4, reps: '10次', restTime: 90, bodyPart: '腿' },
      { id: 'leg_press', name: '腿举', gifUrl: '', notes: '脚放在踏板中上部，控制深度', sets: 4, reps: '12次', restTime: 90, bodyPart: '腿' },
      { id: 'leg_extension', name: '腿屈伸', gifUrl: '', notes: '控制顶部收缩，不要完全锁死膝盖', sets: 4, reps: '15次', restTime: 60, bodyPart: '股四' },
      { id: 'leg_curl', name: '腿弯举', gifUrl: '', notes: '控制离心阶段，感受大腿后侧发力', sets: 4, reps: '12次', restTime: 60, bodyPart: '股二' },
      { id: 'calf_raise', name: '站姿提踵', gifUrl: '', notes: '充分拉伸和收缩小腿', sets: 4, reps: '20次', restTime: 45, bodyPart: '小腿' },
    ],
    cardio: { type: '爬坡', duration: 30 },
  },
  4: { // 周四：肩
    id: 'thu_shoulders',
    name: '肩',
    exercises: [
      { id: 'ohp', name: '杠铃推举', gifUrl: '', notes: '核心收紧，杠铃从锁骨位置推至头顶', sets: 4, reps: '10次', restTime: 90, bodyPart: '肩' },
      { id: 'lateral_raise', name: '侧平举', gifUrl: '', notes: '手臂微弯，哑铃举至肩高，手腕不高于肘', sets: 4, reps: '15次', restTime: 60, bodyPart: '中束' },
      { id: 'front_raise', name: '前平举', gifUrl: '', notes: '交替或同时举至肩高', sets: 3, reps: '12次', restTime: 60, bodyPart: '前束' },
      { id: 'rear_delt_fly', name: '反向飞鸟', gifUrl: '', notes: '俯身，哑铃向两侧打开', sets: 4, reps: '15次', restTime: 60, bodyPart: '后束' },
      { id: 'face_pull', name: '面拉', gifUrl: '', notes: '绳索拉向面部，外旋肩关节', sets: 3, reps: '15次', restTime: 60, bodyPart: '肩' },
      { id: 'shrug', name: '哑铃耸肩', gifUrl: '', notes: '大重量，短程收缩，刺激斜方肌', sets: 3, reps: '15次', restTime: 60, bodyPart: '斜方' },
    ],
    cardio: { type: '爬坡', duration: 30 },
  },
  5: { // 周五：胸 + 背
    id: 'fri_chest_back',
    name: '胸 + 背（超级组）',
    exercises: [
      { id: 'bench_row_superset', name: '卧推 + 划船 超级组', gifUrl: '', notes: '卧推一组→划船一组→休息90秒', sets: 4, reps: '各10次', restTime: 90, bodyPart: '胸背' },
      { id: 'incline_pulldown', name: '上斜卧推 + 高位下拉', gifUrl: '', notes: '超级组模式', sets: 3, reps: '各10次', restTime: 90, bodyPart: '胸背' },
      { id: 'flye_row', name: '飞鸟 + 坐姿划船', gifUrl: '', notes: '超级组模式', sets: 3, reps: '各12次', restTime: 60, bodyPart: '胸背' },
      { id: 'dips_pullup', name: '双杠 + 引体', gifUrl: '', notes: '超级组模式', sets: 3, reps: '力竭', restTime: 90, bodyPart: '胸背' },
    ],
    cardio: { type: '爬坡', duration: 30 },
  },
  6: { // 周六：核心 + 有氧
    id: 'sat_core',
    name: '核心 + 有氧',
    exercises: [
      { id: 'plank', name: '平板支撑', gifUrl: '', notes: '核心收紧，身体呈一条直线', sets: 3, reps: '60秒', restTime: 60, bodyPart: '核心' },
      { id: 'hanging_leg_raise', name: '悬垂举腿', gifUrl: '', notes: '控制下落，不要摆动', sets: 3, reps: '15次', restTime: 60, bodyPart: '腹' },
      { id: 'russian_twist', name: '俄罗斯转体', gifUrl: '', notes: '双脚离地，左右旋转', sets: 3, reps: '20次', restTime: 45, bodyPart: '腹斜' },
      { id: 'dead_bug', name: '死虫式', gifUrl: '', notes: '对侧手脚同时伸展，核心稳定', sets: 3, reps: '12次/侧', restTime: 45, bodyPart: '核心' },
      { id: 'back_extension', name: '山羊挺身', gifUrl: '', notes: '控制幅度，感受下背部发力', sets: 3, reps: '15次', restTime: 60, bodyPart: '下背' },
    ],
    cardio: { type: '跑步', duration: 40 },
  },
  0: { // 周日：休息
    id: 'sun_rest',
    name: '休息日',
    exercises: [
      { id: 'walk', name: '散步 40分钟', gifUrl: '', notes: '轻松散步，帮助恢复', sets: 1, reps: '40分钟', restTime: 0, bodyPart: '恢复' },
      { id: 'stretch', name: '全身拉伸', gifUrl: '', notes: '每个部位拉伸30秒，帮助肌肉恢复', sets: 1, reps: '15分钟', restTime: 0, bodyPart: '拉伸' },
    ],
  },
};

// 根据日期获取当天训练计划
export function getTodayWorkout(): WorkoutPlan {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return WEEKLY_PLAN[day] || WEEKLY_PLAN[0];
}

// 星期映射
export const WEEKDAY_NAMES: Record<number, string> = {
  0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六',
};
