import React from 'react';
import { useApp, todayStr } from '../store/AppContext';
import { getTodayWorkout, WEEKDAY_NAMES } from '../data/workouts';
import type { Exercise } from '../types';

export default function WorkoutPage() {
  const { dispatch, todayRecord, state } = useApp();
  const today = todayStr();
  const workout = getTodayWorkout();
  const dayOfWeek = new Date().getDay();

  const toggleExercise = (id: string) => {
    dispatch({ type: 'TOGGLE_EXERCISE', date: today, exerciseId: id });
  };

  const toggleCardio = () => {
    dispatch({ type: 'SET_CARDIO', date: today, completed: !todayRecord.cardioCompleted });
  };

  const allExercisesDone = workout.exercises.every((ex) => todayRecord.workouts[ex.id]);
  const allDone = allExercisesDone && (todayRecord.cardioCompleted || !workout.cardio);

  const handleCompleteWorkout = () => {
    dispatch({ type: 'SET_WORKOUT_DONE', date: today });
  };

  // 计算完成进度
  const totalItems = workout.exercises.length + (workout.cardio ? 1 : 0);
  const doneItems = workout.exercises.filter((ex) => todayRecord.workouts[ex.id]).length +
    (todayRecord.cardioCompleted ? 1 : 0);

  return (
    <div className="animate-fade-in space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">💪 今日训练</h2>
          <p className="text-white/40 text-sm">
            {WEEKDAY_NAMES[dayOfWeek]} · {workout.name}
          </p>
        </div>
        <div className="glass px-3 py-1.5 rounded-full text-sm font-bold text-brand-primary">
          {doneItems}/{totalItems}
        </div>
      </div>

      {/* 完成进度条 */}
      <div className="glass p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">训练进度</span>
          <span className="font-bold text-brand-primary">{Math.round((doneItems / totalItems) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(doneItems / totalItems) * 100}%` }} />
        </div>
      </div>

      {/* 力量训练 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/50 px-1">🏋️ 力量训练</h3>
        {workout.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            isDone={!!todayRecord.workouts[ex.id]}
            onToggle={() => toggleExercise(ex.id)}
          />
        ))}
      </div>

      {/* 有氧 */}
      {workout.cardio && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/50 px-1">🏃 有氧</h3>
          <div
            onClick={toggleCardio}
            className="glass p-4 tap-active flex items-center gap-3"
          >
            <div className={`check-circle ${todayRecord.cardioCompleted ? 'checked' : ''}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${todayRecord.cardioCompleted ? 'text-white/40 line-through' : 'text-white/80'}`}>
                {workout.cardio.type} {workout.cardio.duration}分钟
              </p>
              <p className="text-white/25 text-xs">坡度12，速度4.5-5.5</p>
            </div>
            <span className="text-orange-400 text-sm font-medium">
              ~{workout.cardio.duration * 6} kcal
            </span>
          </div>
        </div>
      )}

      {/* 完成训练按钮 */}
      {!todayRecord.workoutCompleted && allDone && (
        <button
          onClick={handleCompleteWorkout}
          className="w-full py-4 bg-brand-primary text-black font-bold text-lg rounded-2xl tap-active animate-fade-in"
        >
          🎉 完成今日训练！
        </button>
      )}

      {todayRecord.workoutCompleted && (
        <div className="glass-strong p-5 text-center space-y-2 animate-fade-in">
          <span className="text-4xl">🏆</span>
          <p className="text-lg font-bold text-brand-primary">今日训练已完成！</p>
          <p className="text-white/40 text-sm">今天消耗约 {workout.cardio ? workout.cardio.duration * 6 + workout.exercises.length * 80 : workout.exercises.length * 80} kcal</p>
          <div className="flex gap-2 justify-center text-sm text-white/40 pt-1">
            <span>🥤蛋白粉</span><span>💊肌酸</span><span>🍗鸡胸200g</span>
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}

function ExerciseCard({ exercise, isDone, onToggle }: { exercise: Exercise; isDone: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} className={`glass p-4 tap-active transition-all ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`check-circle ${isDone ? 'checked' : ''}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-medium text-sm ${isDone ? 'line-through text-white/40' : 'text-white/85'}`}>
              {exercise.name}
            </p>
            <span className="text-white/20 text-xs">{exercise.bodyPart}</span>
          </div>
          <p className="text-white/30 text-xs mt-0.5">
            {exercise.sets} 组 × {exercise.reps} · 休息 {exercise.restTime}s
          </p>
          {exercise.notes && (
            <p className="text-white/20 text-xs mt-1 line-clamp-2">💡 {exercise.notes}</p>
          )}
        </div>
        <span className="text-white/15 text-lg">→</span>
      </div>
    </div>
  );
}
