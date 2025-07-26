import React, { useState, useEffect, useRef } from 'react';
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
      // Query database with YYYY-MM-DD format
      const dateStringForDB = selectedDate.toISOString().split('T')[0];
      // Store in completions state with toDateString() format for week progress
      const dateStringForState = selectedDate.toDateString();
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('date', dateStringForDB);
      if (!error) {
        setCompletions(prev => ({ ...prev, [dateStringForState]: new Set((data || []).map((row: any) => row.habit_id)) }));
      }
    };
    fetchCompletions();
  }, [user, selectedDate]);

  // Move fetchCompletionsForYear and its useEffect to the top level, not inside the render
  const fetchCompletionsForYear = async () => {
    console.log('fetchCompletionsForYear called');
    if (!user) {
      console.log('No user, returning');
      return;
    }
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
    const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0];
    console.log('Fetching completions for year:', year, 'from', startOfYear, 'to', endOfYear);
    
    const { data, error } = await supabase
      .from('habit_completions')
      .select('habit_id, date')
      .eq('user_id', user.id)
      .gte('date', startOfYear)
      .lte('date', endOfYear);
    
    console.log('Supabase response:', { data, error });
    
    if (!error) {
      // Update habitCompletions for habit tracker grid
      const grouped: { [habitId: number]: string[] } = {};
      // Also update completions for week progress
      const weekProgressCompletions: { [date: string]: Set<number> } = {};
      
      (data || []).forEach((row: any) => {
        // For habitCompletions (YYYY-MM-DD format)
        if (!grouped[row.habit_id]) grouped[row.habit_id] = [];
        grouped[row.habit_id].push(row.date);
        
        // For week progress (toDateString() format)
        const dateForWeekProgress = new Date(row.date).toDateString();
        if (!weekProgressCompletions[dateForWeekProgress]) {
          weekProgressCompletions[dateForWeekProgress] = new Set();
        }
        weekProgressCompletions[dateForWeekProgress].add(row.habit_id);
      });
      
      console.log('Setting habitCompletions to:', grouped);
      setHabitCompletions(grouped);
      setCompletions(prev => ({ ...prev, ...weekProgressCompletions }));
      
      setTimeout(() => {
        console.log('Updated completions for all habits:', grouped);
        console.log('Updated week progress completions:', weekProgressCompletions);
      }, 500);
    } else {
      console.error('Error fetching completions:', error);
    }
  };
  useEffect(() => {
    console.log('useEffect for fetchCompletionsForYear triggered, user:', user, 'habits count:', habits.length);
    fetchCompletionsForYear();
  }, [user, habits]);

  // Set loading to false after initial data fetch
  useEffect(() => {
    if (user && habits.length >= 0) {
      setIsLoading(false);
    }
  }, [user, habits]);

  // Sync state with database when component unmounts
  useEffect(() => {
    return () => {
      // Sync any pending optimistic updates with database
      if (user) {
        fetchCompletionsForYear();
      }
    };
  }, [user]);

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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    // Remove window.location.reload() - let the auth listener handle the state change
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStreaks, setShowStreaks] = useState(false); // Placeholder for streaks/history modal
  const [isLoading, setIsLoading] = useState(true);
  const [showWeekHighlight, setShowWeekHighlight] = useState(true);
  const [currentWeekHabitId, setCurrentWeekHabitId] = useState<number | null>(null);
  const habitContainerRef = useRef<HTMLDivElement>(null);

  // Auto-hide week highlight after 3 seconds
  useEffect(() => {
    if (showWeekHighlight) {
      const timer = setTimeout(() => {
        setShowWeekHighlight(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWeekHighlight]);

  

  const fetchHabits = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setHabits(data || []);
    setIsLoading(false);
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

  // Helper to format date as YYYY-MM-DD in local time
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="bg-[#181e29] min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 mx-auto">
        {/* Top Row: Quote, Week View, Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8">
          {/* Left: Quote + Week View stacked */}
          <div className="flex flex-col gap-8 h-full w-full">
            {/* Quote Card */}
            {isLoading ? (
              <div className="flex-1 rounded-2xl bg-[#232b3b] px-4 md:px-8 py-8 flex flex-col items-center justify-center text-center min-h-[160px] w-full h-full relative animate-pulse">
                <div className="w-8 h-8 bg-gray-600 rounded-full mb-4"></div>
                <div className="w-3/4 h-6 bg-gray-600 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-600 rounded"></div>
              </div>
            ) : (
              <div className="flex-1 rounded-2xl bg-[#232b3b] px-4 md:px-8 py-8 flex flex-col items-center justify-center text-center min-h-[160px] w-full h-full relative">
                {/* Sign Out Button - Top Right Corner of Quote Card */}
                <button
                  onClick={handleSignOut}
                  className="absolute top-3 right-3 p-2 bg-[#2d3748] hover:bg-[#374151] text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Sign Out"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <span className="text-yellow-400 text-3xl mb-2 font-bold">"</span>
                <p className="text-lg md:text-xl text-[#cfd8e3] italic mb-2">"The only way to do great work is to love what you do."</p>
                <p className="text-base font-bold text-white">- Steve Jobs</p>
              </div>
            )}
            {/* Week View Card */}
            {isLoading ? (
              <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl px-6 py-5 flex flex-col justify-center min-h-[160px] w-full relative overflow-hidden shadow-sm border border-slate-600/30 animate-pulse">
                <div className="w-24 h-4 bg-gray-600 rounded mb-2"></div>
                <div className="w-32 h-3 bg-gray-600 rounded mb-6"></div>
                <div className="flex justify-between items-center">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-3 bg-gray-600 rounded"></div>
                      <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
            )}
          </div>
          {/* Right: Calendar Card */}
          {isLoading ? (
            <div className="flex-1 rounded-2xl bg-[#232b3b] px-4 md:px-12 py-6 flex flex-col items-center justify-center min-h-[340px] w-full h-full animate-pulse">
              <div className="w-32 h-6 bg-gray-600 rounded mb-4"></div>
              <div className="grid grid-cols-7 gap-2 w-full mb-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="text-[#cfd8e3] text-xs text-center font-semibold w-10 h-10 flex items-center justify-center">
                    <div className="w-6 h-3 bg-gray-600 rounded"></div>
                  </div>
                ))}
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center w-10">
                    <div className="w-4 h-3 bg-gray-600 rounded mb-1"></div>
                    <div className="w-10 h-10 bg-gray-600 rounded-md"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
                  const dateForDB = formatDateLocal(date);
                  const today = new Date(new Date().setHours(0, 0, 0, 0));
                  
                  // Use habitCompletions to determine status (same as grid)
                  const completedHabitsForDate = habits.filter(habit => 
                    habitCompletions[habit.id]?.includes(dateForDB)
                  ).length;
                  const isCompleted = completedHabitsForDate === habits.length && habits.length > 0;
                  const isMissed = completedHabitsForDate > 0 && completedHabitsForDate < habits.length;
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
                    if (isFutureDate) return;

                    const dateForWeekProgress = date.toDateString();
                    const dateForDB = formatDateLocal(date);

                    // Check if all habits are completed for this date using habitCompletions (same as grid)
                    const completedHabitsForDate = habits.filter(habit => 
                      habitCompletions[habit.id]?.includes(dateForDB)
                    ).length;
                    const isAllCompleted = completedHabitsForDate === habits.length && habits.length > 0;

                    // Optimistically update state
                    if (isAllCompleted) {
                      // Remove completions for all habits for this date
                      setCompletions(prev => {
                        const updated = { ...prev };
                        delete updated[dateForWeekProgress];
                        return updated;
                      });
                      setHabitCompletions(prev => {
                        const updated = { ...prev };
                        habits.forEach(habit => {
                          if (updated[habit.id]) {
                            updated[habit.id] = updated[habit.id].filter((d: string) => d !== dateForDB);
                          }
                        });
                        return updated;
                      });
                      // Don't call setHabits to avoid triggering useEffect
                      // setHabits(hs => [...hs]);
                      // Remove from DB
                      if (user) {
                        const { error } = await supabase
                          .from('habit_completions')
                          .delete()
                          .eq('user_id', user.id)
                          .eq('date', dateForDB);
                        
                        if (error) {
                          console.error('Error removing from DB:', error);
                        }
                      }
                    } else {
                      // Add completions for all habits for this date
                      setCompletions(prev => {
                        const updated = { ...prev };
                        updated[dateForWeekProgress] = new Set(habits.map(habit => habit.id));
                        return updated;
                      });
                      setHabitCompletions(prev => {
                        const updated = { ...prev };
                        habits.forEach(habit => {
                          if (!updated[habit.id]) updated[habit.id] = [];
                          if (!updated[habit.id].includes(dateForDB)) {
                            updated[habit.id] = [...updated[habit.id], dateForDB];
                          }
                        });
                        return updated;
                      });
                      // Don't call setHabits to avoid triggering useEffect
                      // setHabits(hs => [...hs]);
                      // Add to DB
                      if (user && habits.length > 0) {
                        const completionData = habits.map(habit => ({
                          user_id: user.id,
                          habit_id: habit.id,
                          date: dateForDB
                        }));
                        
                        // First delete any existing completions for this date to avoid conflicts
                        const { error: deleteError } = await supabase
                          .from('habit_completions')
                          .delete()
                          .eq('user_id', user.id)
                          .eq('date', dateForDB);
                        
                        if (deleteError) {
                          console.error('Error deleting existing completions:', deleteError);
                        }
                        
                        // Then insert the new completions
                        const { error } = await supabase
                          .from('habit_completions')
                          .insert(completionData);
                        
                        if (error) {
                          console.error('Error adding to DB:', error);
                        }
                      }
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
            )}
        </div>
        {/* Habit Tracker Section */}
        <div className="rounded-2xl bg-[#232b3b] px-4 md:px-8 py-6 mt-8 w-full" style={{ minHeight: '260px' }}>
          <div className="flex items-center mb-4">
                                        <span className="text-white font-bold text-lg">Habit Tracker</span>
            </div>
          {/* Habit cards row */}
          <div 
            className="flex flex-row items-center w-full flex-nowrap overflow-x-auto no-scrollbar" 
            style={{ 
              minHeight: '180px',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth'
            }}
            ref={habitContainerRef}
          >
            {isLoading ? (
              <div className="flex flex-row items-center w-full flex-nowrap overflow-x-auto no-scrollbar" style={{ minHeight: '180px' }}>
                <div className="w-full flex flex-col items-center justify-center min-h-[180px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                  <p className="text-white text-lg mt-4">Loading habits...</p>
                </div>
              </div>
            ) : habits.length === 0 ? (
              <div className="text-center text-gray-400 flex items-center justify-center w-full">No habits yet. Add your first habit!</div>
            ) : (
              // Sort habits to put current week habits first
              habits
                .map((habit, idx) => {
                  // Check if this habit belongs to current week based on recent activity
                  const today = new Date();
                  const weekStart = new Date(today);
                  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
                  
                  const habitCompletionsForWeek = habitCompletions[habit.id]?.filter(date => {
                    const completionDate = new Date(date);
                    return completionDate >= weekStart && completionDate <= today;
                  }) || [];
                  
                  const isCurrentWeek = habitCompletionsForWeek.length > 0 || idx === 0; // Highlight if has completions this week or is first habit
                  
                  // Set current week habit ID for scrolling
                  if (isCurrentWeek && !currentWeekHabitId) {
                    setCurrentWeekHabitId(habit.id);
                  }
                  
                  return { habit, isCurrentWeek, originalIndex: idx };
                })
                .sort((a, b) => {
                  // Sort current week habits first - this ensures they appear at the beginning
                  if (a.isCurrentWeek && !b.isCurrentWeek) return -1;
                  if (!a.isCurrentWeek && b.isCurrentWeek) return 1;
                  return a.originalIndex - b.originalIndex; // Maintain original order within groups
                })
                .map(({ habit, isCurrentWeek }, displayIndex) => (
                  <div
                    key={habit.id}
                    id={`habit-${habit.id}`}
                    className={`transition-all duration-300`}
                    style={{
                      width: 340,
                      minWidth: "32%",
                      maxWidth: "50%",
                      flexShrink: 0,
                      flexGrow: 0,
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: displayIndex !== habits.length - 1 ? 24 : 0,
                      scrollSnapAlign: 'start'
                    }}
                  >

                    <HabitCard
                      habit={{ ...habit, completions: habitCompletions[habit.id] ? habitCompletions[habit.id] : [] }}
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
                        // Don't call fetchCompletionsForYear here to avoid overriding optimistic updates
                        // fetchCompletionsForYear();
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