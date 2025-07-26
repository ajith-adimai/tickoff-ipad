import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Dumbbell, 
  Palette, 
  Sun, 
  Calendar, 
  Target, 
  TrendingUp, 
  Star,
  ArrowRight,
  Download,
  Smartphone,
  Zap,
  LogOut,
  Home,
  LayoutGrid,
  Plus
} from 'lucide-react';

import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import AddHabitModal from './AddHabitModal';
import HabitCard from './HabitCard';
// Remove all dnd-kit imports and logic

// CSS for hiding scrollbar
const scrollbarStyles = `
  .progress-grid-scroll::-webkit-scrollbar {
    display: none;
  }
  .progress-grid-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDashboard?: () => void;
  user?: User | null;
}

// TopBar Widget Component
const TopBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-6 mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-medium text-base md:text-lg">
              Today, {new Date().toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
            <p className="text-xs md:text-sm text-blue-100">Current Date</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 md:p-3 hover:bg-white/20 rounded-lg transition-colors" title="Calendar">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
          <button className="p-2 md:p-3 hover:bg-white/20 rounded-lg transition-colors" title="Target">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// DaySelector Widget Component
const DaySelector: React.FC<{ completions: { [date: string]: Set<number> }, totalHabits: number, selectedDate: Date, onDateChange: (date: Date) => void }> = ({ completions, totalHabits, selectedDate, onDateChange }) => {
  const getCurrentWeek = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    const monday = new Date(today);
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    monday.setDate(today.getDate() - daysToSubtract);
    
    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      weekDays.push({
        day: dayNames[i],
        date: date.getDate(),
        completed: false, // All dates start as gray
        current: date.toDateString() === today.toDateString(),
        fullDate: date
      });
    }
    
    return weekDays;
  };

  const days = getCurrentWeek();

  // Count completed habits for today
  const todayString = new Date().toDateString();
  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 md:p-6 mb-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-base md:text-lg">Week View</h3>
          <p className="text-xs md:text-sm text-green-100">Current Week Progress</p>
        </div>
      </div>
      <div className="flex justify-between mb-2">
        {days.map((day) => (
          <span key={day.date} className="text-xs md:text-sm text-green-100">
            {day.day}
          </span>
        ))}
      </div>
      <div className="flex justify-between">
        {days.map((day) => {
          const isToday = day.fullDate.toDateString() === todayString;
          const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();
          const dateString = day.fullDate.toDateString();
          const completedHabitsCount = completions[dateString]?.size || 0;
          const progressPercentage = totalHabits > 0 ? (completedHabitsCount / totalHabits) * 100 : 0;
          const strokeDasharray = 2 * Math.PI * 16;
          const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercentage / 100);
          return (
            <button
              key={day.date}
              className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gray-500 text-white border-2 border-yellow-400'
                  : isToday
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
              onClick={() => {
                if (day.fullDate <= new Date()) onDateChange(day.fullDate);
              }}
              disabled={day.fullDate > new Date()}
              style={{ overflow: 'visible' }}
            >
              {day.date}
              {totalHabits > 0 && progressPercentage > 0 && (
                <svg className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 pointer-events-none" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="rgb(234 179 8)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const Footer: React.FC<{ onAdd: () => void; onStreaks: () => void }> = ({ onAdd, onStreaks }) => (
  <div className="fixed bottom-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-black border-t border-gray-800 z-50">
    {/* Dashboard/Home */}
    <button className="flex flex-col items-center text-yellow-400 hover:text-yellow-300 transition-colors" title="Dashboard/Home">
      <LayoutGrid className="w-7 h-7" />
    </button>
    {/* Add (+) */}
    <button
      className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black shadow-lg border-4 border-black -mt-10 hover:bg-gray-200 transition-all text-3xl"
      style={{ position: 'relative', top: '-24px' }}
      onClick={onAdd}
      aria-label="Add new event"
    >
      <Plus className="w-8 h-8" />
    </button>
    {/* Streaks/History */}
    <button
      className="flex flex-col items-center text-pink-400 hover:text-pink-300 transition-colors"
      onClick={onStreaks}
      aria-label="View streaks/history"
    >
      <TrendingUp className="w-7 h-7" />
    </button>
  </div>
);

// Remove all dnd-kit imports and logic

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDashboard, user }) => {
  console.log('LandingPage component rendered with user:', user);
  
  const [completions, setCompletions] = useState<{ [date: string]: Set<number> }>({});
  const [habitCompletions, setHabitCompletions] = useState<{ [habitId: number]: string[] }>({});

  const [habits, setHabits] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingHabit, setEditingHabit] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    let subscription: any;
    const fetchHabits = async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setHabits(data || []);
    };
    fetchHabits();
    subscription = supabase
      .channel('public:habits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` }, () => {
        fetchHabits();
      })
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !selectedDate) return;
    const fetchCompletions = async () => {
      const dateString = selectedDate.toDateString();
      const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('date', dateString);
      if (!error) {
        setCompletions(prev => ({ ...prev, [dateString]: new Set((data || []).map((row: any) => row.habit_id)) }));
      }
    };
    fetchCompletions();
  }, [user, selectedDate]);

  // Move fetchCompletionsForYear and its useEffect to the top level, not inside the render
  const fetchCompletionsForYear = async () => {
    if (!user) return;
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
    const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('habit_completions')
      .select('habit_id, date')
      .eq('user_id', user.id)
      .gte('date', startOfYear)
      .lte('date', endOfYear);
    if (!error) {
      const grouped: { [habitId: number]: string[] } = {};
      (data || []).forEach((row: any) => {
        if (!grouped[row.habit_id]) grouped[row.habit_id] = [];
        grouped[row.habit_id].push(row.date);
      });
      setHabitCompletions(grouped);
      setTimeout(() => {
        console.log('Updated completions for all habits:', grouped);
      }, 500);
    }
  };
  useEffect(() => {
    fetchCompletionsForYear();
  }, [user, habits]);

  const handleHabitToggle = (habitId: number, completed: boolean) => {
    setCompletions(prev => {
      const date = new Date().toDateString();
      const set = new Set(prev[date] || []);
      if (completed) set.add(habitId);
      else set.delete(habitId);
      return { ...prev, [date]: set };
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStreaks, setShowStreaks] = useState(false); // Placeholder for streaks/history modal

  const fetchHabits = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setHabits(data || []);
  };

  // Remove all dnd-kit imports and logic

  const getCurrentWeek = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    const monday = new Date(today);
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    monday.setDate(today.getDate() - daysToSubtract);
    
    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      weekDays.push({
        day: dayNames[i],
        date: date.getDate(),
        completed: false, // All dates start as gray
        current: date.toDateString() === today.toDateString(),
        fullDate: date
      });
    }
    
    return weekDays;
  };

  // Helper for calendar grid icons/colors
  const getCalendarDayStatus = (
    date: Date,
    completions: { [date: string]: Set<number> },
    habits: any[],
    today: Date,
    selectedDate: Date
  ): 'future' | 'today' | 'complete' | 'partial' | 'missed' | 'default' => {
    if (date > today) return 'future';
    const dateString = date.toDateString();
    if (date.toDateString() === today.toDateString()) return 'today';
    if (completions[dateString]?.size === habits.length && habits.length > 0) return 'complete';
    if (completions[dateString]?.size > 0) return 'partial';
    if (date < today) return 'missed';
    return 'default';
  };

  return (
    <div className="bg-[#181e29] min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 mx-auto">
        {/* Top Row: Quote, Week View, Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8">
          {/* Left: Quote + Week View stacked */}
          <div className="flex flex-col gap-8 h-full w-full">
            {/* Quote Card */}
            <div className="flex-1 rounded-2xl bg-[#232b3b] px-4 md:px-8 py-8 flex flex-col items-center justify-center text-center min-h-[160px] w-full h-full">
              <span className="text-yellow-400 text-3xl mb-2 font-bold">”</span>
              <p className="text-lg md:text-xl text-[#cfd8e3] italic mb-2">"The only way to do great work is to love what you do."</p>
              <p className="text-base font-bold text-white">- Steve Jobs</p>
            </div>
            {/* Week View Card */}
            <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl px-6 py-5 flex flex-col justify-center min-h-[160px] w-full relative overflow-hidden shadow-sm border border-slate-600/30">
              {/* Subtle animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse"></div>
              </div>
              
              <div className="mb-4 relative z-10">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-white text-base">Week Progress</span>
                </div>
                <div className="text-gray-300 text-xs">Track your daily achievements</div>
              </div>
              
              <div className="flex justify-between items-center relative z-10">
                {getCurrentWeek().map((day, index) => {
                  const dateString = day.fullDate.toDateString();
                  const completedHabits = completions[dateString]?.size || 0;
                  const totalHabits = habits.length;
                  const progress = totalHabits > 0 ? completedHabits / totalHabits : 0;
                  const isSelected = dateString === selectedDate.toDateString();
                  const isToday = day.fullDate.toDateString() === new Date().toDateString();
                  const isFuture = day.fullDate > new Date();
                  
                  return (
                    <div key={day.date} className="flex flex-col items-center space-y-1.5">
                      {/* Day label */}
                      <span className={`text-xs font-medium transition-all duration-150 ${
                        isSelected ? 'text-blue-400 font-bold' :
                        isToday ? 'text-yellow-400 font-semibold' : 'text-gray-400'
                      }`}>
                        {day.day}
                      </span>
                      
                      {/* Main progress circle */}
                      <div className="relative group">
                        <button
                          className={`
                            relative w-10 h-10 rounded-full flex items-center justify-center 
                            transition-all duration-150 ease-out transform
                            ${isSelected ? 'scale-110 ring-3 ring-blue-400 shadow-lg' : 'hover:scale-105 hover:shadow-sm'}
                            ${isFuture ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                            ${isSelected ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' :
                              progress === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm' : 
                              progress > 0 ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-sm' :
                              'bg-slate-600 border border-slate-500 shadow-sm'}
                          `}
                          onClick={() => !isFuture && setSelectedDate(day.fullDate)}
                          disabled={isFuture}
                        >
                          {/* Animated progress ring */}
                          <svg className="absolute inset-0 w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-slate-500"
                              strokeDasharray="100.5"
                              strokeDashoffset="100.5"
                            />
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className={`transition-all duration-400 ease-out ${
                                progress === 1 ? 'text-green-400' : 'text-orange-400'
                              }`}
                              strokeDasharray="100.5"
                              strokeDashoffset={100.5 - (100.5 * progress)}
                              strokeLinecap="round"
                            />
                          </svg>
                          
                          {/* Center content */}
                          <div className="relative z-10 flex items-center justify-center">
                            {isSelected ? (
                              <span className="text-white text-sm font-bold">✓</span>
                            ) : progress === 1 ? (
                              <span className="text-white text-sm font-bold animate-pulse">✓</span>
                            ) : progress > 0 ? (
                              <span className="text-white text-xs font-semibold">{Math.round(progress * 100)}%</span>
                            ) : (
                              <span className="text-gray-300 text-xs font-medium">{day.date}</span>
                            )}
                          </div>
                          
                          {/* Subtle glow effect for completed */}
                          {progress === 1 && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/10 to-emerald-500/10 animate-pulse"></div>
                          )}
                        </button>
                        
                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-100 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                          {completedHabits}/{totalHabits} habits completed
                        </div>
                      </div>
                      
                      {/* Date number */}
                      <span className={`text-xs font-medium transition-all duration-150 ${
                        isSelected ? 'text-blue-400 font-bold' :
                        isToday ? 'text-yellow-400 font-semibold' : 'text-gray-400'
                      }`}>
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Subtle bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>
          </div>
          {/* Right: Calendar Card */}
          <div className="flex-1 rounded-2xl bg-[#232b3b] px-4 md:px-12 py-6 flex flex-col items-center justify-center min-h-[340px] w-full h-full">
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-white text-xl font-bold">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-[#232b3b]" title="Previous Month">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#cfd8e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="p-2 rounded-full hover:bg-[#232b3b]" title="Next Month">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#cfd8e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 w-full mb-2">
              {/* Unified weekday headers and date cells for perfect alignment */}
              {(() => {
                const grid: React.ReactNode[] = [];
                ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach((d) => {
                  grid.push(<div key={d} className="text-[#cfd8e3] text-xs text-center font-semibold w-10 h-10 flex items-center justify-center">{d}</div>);
                });
                const month: number = selectedDate.getMonth();
                const year: number = selectedDate.getFullYear();
                const daysInMonth: number = new Date(year, month + 1, 0).getDate();
                const firstDayOfMonth: number = new Date(year, month, 1).getDay();
                const days: React.ReactNode[] = [];
                // Remove empty cells before the 1st
                // for (let i = 0; i < firstDayOfMonth; i++) {
                //   days.push(
                //     <div key={`empty-${i}`} className="flex flex-col items-center w-10">
                //       <span className="text-[10px] font-semibold text-[#cfd8e3] mb-1"></span>
                //       <div className="w-10 h-10 rounded-md border-2 border-gray-500 bg-transparent flex items-center justify-center"></div>
                //     </div>
                //   );
                // }
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  const dateString = date.toDateString();
                  const today = new Date(new Date().setHours(0, 0, 0, 0));
                  const isCompleted = completions[dateString]?.size === habits.length && habits.length > 0;
                  const isMissed = completions[dateString]?.size > 0 && completions[dateString]?.size < habits.length;
                  const isSelected = dateString === selectedDate.toDateString();
                  const isPastDate = date < today;
                  const isFutureDate = date > today;
                  const isToday = date.getTime() === today.getTime();
                  
                  let border = 'border-2 border-gray-500 bg-transparent';
                  if (isCompleted) border = 'border-2 border-green-400 bg-green-400/10';
                  else if (isMissed) border = 'border-2 border-red-400 bg-red-400/10';
                  else if (isSelected) border = 'border-2 border-yellow-400 bg-yellow-400/10';
                  
                  let content: React.ReactNode = '';
                  if (isCompleted) {
                    content = <span className="text-green-400 text-lg font-bold">✓</span>;
                  } else if (isMissed) {
                    content = <span className="text-red-400 text-lg font-bold">✗</span>;
                  } else if (isPastDate) {
                    content = <span className="text-red-400 text-lg font-bold">✗</span>;
                  } else if (isToday) {
                    content = <span className="text-green-400 text-lg font-bold">✓</span>;
                  } else if (isFutureDate) {
                    content = <span className="text-white text-sm font-bold"></span>;
                  }
                  
                  const handleCalendarDayClick = async (e: React.MouseEvent | React.TouchEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Only allow interaction for past and current dates
                    if (isFutureDate) return;
                    
                    console.log('Calendar day clicked:', day, 'Date:', dateString);
                    setSelectedDate(date);
                    
                    // Simple toggle: if completed, uncomplete; if not completed, complete
                    const currentCompletions = completions[dateString] || new Set();
                    const isCurrentlyCompleted = currentCompletions.size === habits.length && habits.length > 0;
                    
                    try {
                      if (isCurrentlyCompleted) {
                        // Remove all completions for this date
                        const updatedCompletions = { ...completions };
                        delete updatedCompletions[dateString];
                        setCompletions(updatedCompletions);
                        
                        // Remove from database
                        if (user) {
                          await supabase
                            .from('habit_completions')
                            .delete()
                            .eq('user_id', user.id)
                            .eq('date', dateString);
                        }
                      } else {
                        // Mark all habits as completed for this date
                        if (user && habits.length > 0) {
                          const completionData = habits.map(habit => ({
                            user_id: user.id,
                            habit_id: habit.id,
                            date: dateString
                          }));
                          
                          await supabase
                            .from('habit_completions')
                            .upsert(completionData, { onConflict: 'user_id,habit_id,date' });
                          
                          // Update local state
                          const newCompletions = new Set(habits.map(habit => habit.id));
                          setCompletions(prev => ({ ...prev, [dateString]: newCompletions }));
                        }
                      }
                      
                      // Refresh completions data
                      setTimeout(() => {
                        fetchCompletionsForYear();
                      }, 100);
                    } catch (error) {
                      console.error('Error toggling completion:', error);
                    }
                  };
                  
                  days.push(
                    <div key={day} className="flex flex-col items-center w-10">
                      <span className="text-[10px] font-semibold text-[#cfd8e3] mb-1">{day}</span>
                      <div
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${border} transition-all duration-150 ${
                          isFutureDate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
                        } touch-manipulation select-none focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        onClick={handleCalendarDayClick}
                        onTouchEnd={handleCalendarDayClick}
                        style={{ 
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                          userSelect: 'none',
                          WebkitUserSelect: 'none'
                        }}
                      >
                        {content}
                      </div>
                    </div>
                  );
                }
                // Remove empty cells after the last day
                // const totalCells = firstDayOfMonth + daysInMonth;
                // const currentWeekEnd = Math.ceil(totalCells / 7) * 7;
                // const extraCells = currentWeekEnd - totalCells;
                // for (let i = 0; i < extraCells; i++) {
                //   days.push(
                //     <div key={`post-empty-${i}`} className="flex flex-col items-center w-10">
                //       <span className="text-[10px] font-semibold text-[#cfd8e3] mb-1"></span>
                //       <div className="w-10 h-10 rounded-md border-2 border-gray-500 bg-transparent flex items-center justify-center"></div>
                //     </div>
                //   );
                // }
                return days;
              })()}
            </div>
          </div>
        </div>
        {/* Habit Tracker Section */}
        <div className="rounded-2xl bg-[#232b3b] px-4 md:px-8 py-6 mt-8 w-full" style={{ minHeight: '260px' }}>
          <div className="flex items-center mb-4">
            <span className="text-white font-bold text-lg">Habit Tracker</span>
            <span className="ml-auto text-white/40 text-2xl cursor-pointer">...</span>
          </div>
          {/* Habit cards row */}
          <div className="flex flex-row items-center w-full flex-nowrap overflow-x-auto no-scrollbar" style={{ minHeight: '180px' }}>
            {habits.length === 0 ? (
              <div className="text-center text-gray-400 flex items-center justify-center w-full">No habits yet. Add your first habit!</div>
            ) : (
              habits.map((habit, idx) => (
                <div
                  key={habit.id}
                  style={{
                    width: 340,
                    minWidth: "32%",
                    maxWidth: "50%",
                    flexShrink: 0,
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: idx !== habits.length - 1 ? 24 : 0
                  }}
                >
                  <HabitCard
                    habit={{ ...habit, completions: habitCompletions[habit.id] || [] }}
                    selectedDate={selectedDate}
                    isCompleted={!!completions[selectedDate.toDateString()]?.has(habit.id)}
                    onUpdate={() => {
                      if (!user) return;
                      fetchHabits();
                      fetchCompletionsForYear();
                    }}
                    onCompletionChange={(habitId: number, completed: boolean) => {
                      setCompletions(prev => {
                        const date = selectedDate.toDateString();
                        const set = new Set(prev[date] || []);
                        if (completed) set.add(habitId);
                        else set.delete(habitId);
                        return { ...prev, [date]: set };
                      });
                      fetchCompletionsForYear();
                    }}
                    onEdit={setEditingHabit}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        {/* Add/Edit Habit Modals (existing logic) */}
        {(showAddModal && user && !editingHabit) && (
          <AddHabitModal
            onClose={() => setShowAddModal(false)}
            onAdd={fetchHabits}
            user={user}
          />
        )}
        {editingHabit && user && (
          <AddHabitModal
            onClose={() => setEditingHabit(null)}
            onAdd={() => {
              fetchHabits();
              fetchCompletionsForYear();
              setEditingHabit(null);
            }}
            user={user}
            habit={editingHabit}
            editMode={true}
          />
        )}
      </div>
      {/* Floating Add Button at the bottom center of the page */}
      <button
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 rounded-full h-16 w-16 flex items-center justify-center border-4 border-[#232b3b] z-50 text-4xl shadow-xl"
        onClick={() => setShowAddModal(true)}
        aria-label="Add new habit"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#232b3b"/><path d="M18 11v14M11 18h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
};

export default LandingPage; 

export {} 