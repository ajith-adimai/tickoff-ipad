import React, { useState, useEffect } from 'react';
import { Habit, supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Trash2, Edit } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface HabitCardProps {
  habit: any; // allow dynamic fields from Supabase
  selectedDate: Date;
  isCompleted: boolean;
  selectedHabitsForCalendar?: Set<number>;
  onUpdate: () => void;
  onCompletionChange?: (habitId: number, completed: boolean) => void;
  onEdit?: (habit: any) => void;
}

const hideScrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const HabitCard: React.FC<HabitCardProps> = ({ habit, selectedDate, isCompleted, selectedHabitsForCalendar, onUpdate, onCompletionChange, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find the first Monday of the year
  const year = new Date().getFullYear();

  useEffect(() => {
    checkCompletionStatus();
  }, [selectedDate, habit.id]);

  const checkCompletionStatus = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habit.id)
        .eq('date', dateString);
      // setIsCompleted(!!(data && data.length > 0)); // This line is removed as per the edit hint
    } catch {}
  };

  // Map icon string to Lucide icon component
  const Icon = (LucideIcons as any)[habit.icon] || LucideIcons.Activity;
  // Use color hex from habit.color
  const iconBgStyle = habit.color ? { background: habit.color } : { background: '#FFD600' };
  // Streak fallback
  const streak = habit.streak ?? 0;

  // Year progress grid logic (static fallback if no progress data)
  const completionsSet = new Set((habit.completions || []).map((d: string) => {
    // Always use YYYY-MM-DD format
    if (d.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return d;
    }
    // Convert to YYYY-MM-DD if needed
    return new Date(d).toISOString().split('T')[0];
  }));
  const startOfYear = new Date(year, 0, 1);
  let firstMonday = new Date(startOfYear);
  const day = firstMonday.getDay();
  const diff = (day === 0 ? 1 : 8 - day) % 7; // 0=Sunday, 1=Monday, ..., 6=Saturday
  firstMonday.setDate(firstMonday.getDate() + diff);
  const weekCount = 52;
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const todayString = new Date().toISOString().split('T')[0];

  for (let col = 0; col < weekCount; col++) {
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + col * 7);
    for (let row = 0; row < 7; row++) {
      const cellDate = new Date(weekStart);
      cellDate.setDate(weekStart.getDate() + row);
      const cellDateString = cellDate.toISOString().split('T')[0];
      // if (col === 0) {
      //   console.log(`Row ${row} (should be ${dayNames[row]}):`, cellDateString);
      // }
    }
  }

  // Action buttons
  const handleToggleCompletion = async () => {
    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (!isCompleted) {
        // Mark as complete: insert row
        await supabase.from('habit_completions').insert([
          {
            habit_id: habit.id,
            user_id: habit.user_id,
            date: dateString,
            completed_at: new Date().toISOString(),
          }
        ]);
      } else {
        // Mark as incomplete: delete row
        await supabase.from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .eq('user_id', habit.user_id)
          .eq('date', dateString);
      }
      if (onCompletionChange) onCompletionChange(habit.id, !isCompleted);
      if (onUpdate) await onUpdate(); // always refetch completions
      // Debug log after update
      // setTimeout(() => {
      //   console.log('Habit completions for grid (after update):', habit.title, Array.from((habit.completions || []).map((d: string) => d.split('T')[0])));
      // }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(async () => {
      await supabase.from('habits').delete().eq('id', habit.id);
      if (onUpdate) onUpdate();
    }, 400); // match animation duration
  };

  const isFutureDate = selectedDate > new Date();

  return (
    <motion.div
      layout
      className="bg-gray-700 rounded-xl p-4 md:p-6 shadow-lg w-full"
      style={{ pointerEvents: isDeleting ? 'none' : undefined, position: 'relative' }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
      transition={{ duration: 0.4 }}
    >
      <style>{hideScrollbarStyles}</style>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style={iconBgStyle}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base md:text-lg">{habit.title}</h3>
            <p className="text-sm md:text-base text-gray-400">Streak: {streak} days</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <button className="p-2 md:p-3 hover:bg-gray-600 rounded-lg transition-colors" title="Add Note">
            <LucideIcons.Star className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
          </button> */}
          <button
            onClick={handleToggleCompletion}
            className="p-2 md:p-3 hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            disabled={loading || isFutureDate}
          >
            <LucideIcons.CheckCircle className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-200 ${isCompleted ? 'text-yellow-500' : 'text-gray-400'} ${isFutureDate ? 'opacity-50' : ''}`} />
          </button>
          <button
            onClick={() => onEdit && onEdit(habit)}
            className="p-2 md:p-3 hover:bg-blue-600 rounded-lg transition-colors"
            title="Edit habit"
          >
            <Edit className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 md:p-3 hover:bg-red-600 rounded-lg transition-colors"
            title="Delete habit"
            disabled={isDeleting}
          >
            <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
          </motion.button>
        </div>
      </div>
      {/* Progress Grid */}
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-xs md:text-sm text-gray-400 mb-2">Year Progress (Mon-Sun, each column is a week)</p>
        <div className="overflow-x-auto hide-scrollbar" style={{ maxWidth: '100%' }}>
          <div className="flex flex-col space-y-1" style={{ minWidth: 'max-content' }}>
            {dayNames.map((dayName, row) => {
              const weekDays = [];
              for (let col = 0; col < weekCount; col++) {
                // For each week, weekStart is the Monday of that week
                const weekStart = new Date(firstMonday);
                weekStart.setDate(firstMonday.getDate() + col * 7);
                // Row 0 is Monday, row 1 is Tuesday, ..., row 6 is Sunday
                const cellDate = new Date(weekStart);
                cellDate.setDate(weekStart.getDate() + row);
                const cellDateString = cellDate.toISOString().split('T')[0];
                const isFuture = cellDateString > todayString;
                const isDayCompleted = completionsSet.has(cellDateString);
                // Debug log for each cell
                // if (cellDateString === '2025-07-25') {
                //   console.log('Grid cell', cellDateString, 'isDayCompleted:', isDayCompleted, 'completionsSet:', completionsSet);
                // }
                weekDays.push(
                  <div
                    key={`${col}-${row}`}
                    className="rounded-sm"
                    style={{
                      width: '8px',
                      height: '8px',
                      minWidth: '8px',
                      minHeight: '8px',
                      display: 'inline-block',
                      background: isFuture
                        ? '#4B5563' // gray-600
                        : isDayCompleted
                        ? (habit.color || '#FFD600')
                        : '#374151', // gray-700
                    }}
                    title={`${dayName} ${cellDateString} - ${isFuture ? 'Future' : isDayCompleted ? 'Completed' : 'Not completed'}`}
                  />
                );
              }
              return (
                <div key={row} className="flex gap-1">
                  {weekDays}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard; 