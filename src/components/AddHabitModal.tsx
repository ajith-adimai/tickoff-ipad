import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Target, Palette, Dumbbell, Sun, Star, ArrowLeft, Check, Bookmark, Droplet, Utensils, Moon, Paintbrush, Music, Activity, Key, Aperture, Code, Flower, CheckCircle, Circle, SunMedium, Timer, PawPrint } from 'lucide-react';
import { ChromePicker, ColorResult } from 'react-color';

interface AddHabitModalProps {
  onClose: () => void;
  onAdd: () => void;
  user: User;
}

const hideScrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onAdd, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#FFD600'); // default to yellow hex
  const [icon, setIcon] = useState('Run'); // default to Activity (Run)
  const [frequencyType, setFrequencyType] = useState('everyday');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [daysOfMonth, setDaysOfMonth] = useState<number[]>([]);
  const [periodType, setPeriodType] = useState<'week'|'month'>('week');
  const [daysPerPeriod, setDaysPerPeriod] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [checklistEnabled, setChecklistEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderDays, setReminderDays] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Prepare checklist and reminder data
      const checklist = checklistEnabled ? { items: [] } : null;
      const reminder = reminderEnabled ? { time: reminderTime, days: reminderDays } : null;

      const habitData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        color,
        icon,
        frequency: {
          type: frequencyType,
          days: frequencyType === 'weekdays' ? daysOfWeek : frequencyType === 'monthdays' ? daysOfMonth : null,
          period: frequencyType === 'period' ? { days: daysPerPeriod, type: periodType } : null,
        },
        checklist,
        reminder,
      };

      console.log('Attempting to insert habit:', habitData);

      const { data, error: insertError } = await supabase
        .from('habits')
        .insert(habitData)
        .select();

      if (insertError) {
        console.error('Supabase error:', insertError);
        throw insertError;
      }

      setTitle('');
      setDescription('');
      setColor('#FFD600');
      setIcon('Run');
      setFrequencyType('everyday');
      setDaysOfWeek([]);
      setDaysOfMonth([]);
      setPeriodType('week');
      setDaysPerPeriod(1);
      setChecklistEnabled(false);
      setReminderEnabled(false);
      setReminderTime('09:00');
      setReminderDays([]);
      onAdd();
      onClose();
    } catch (error: any) {
      console.error('Error adding habit:', error);
      setError(error.message || 'Failed to add habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    { value: 'Run', label: 'Run', icon: Activity },
    { value: 'Bookmark', label: 'Bookmark', icon: Bookmark },
    { value: 'Droplet', label: 'Droplet', icon: Droplet },
    { value: 'Utensils', label: 'Utensils', icon: Utensils },
    { value: 'Moon', label: 'Moon', icon: Moon },
    { value: 'Paintbrush', label: 'Paintbrush', icon: Paintbrush },
    { value: 'Music', label: 'Music', icon: Music },
    { value: 'Activity', label: 'Activity', icon: Activity },
    { value: 'Key', label: 'Key', icon: Key },
    { value: 'Aperture', label: 'Aperture', icon: Aperture },
    { value: 'Code', label: 'Code', icon: Code },
    { value: 'Flower', label: 'Flower', icon: Flower },
    { value: 'Check', label: 'Check', icon: Check },
    { value: 'Circle', label: 'Circle', icon: Circle },
    { value: 'SunMedium', label: 'Sun', icon: SunMedium },
    { value: 'Timer', label: 'Timer', icon: Timer },
    { value: 'PawPrint', label: 'Paw', icon: PawPrint },
  ];

  const frequencyOptions = [
    { value: 'everyday', label: 'Everyday' },
    { value: 'weekdays', label: 'Specific days of the week' },
    { value: 'monthdays', label: 'Specific days of the month' },
    { value: 'period', label: 'Some days per period' },
  ];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full h-full sm:h-auto sm:w-full max-w-sm sm:max-w-md mx-auto bg-[#111] shadow-2xl p-0 overflow-hidden relative flex flex-col sm:rounded-3xl"
          onClick={e => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-4 border-b border-[#222] flex-shrink-0">
              <button onClick={onClose} className="text-white p-2 -ml-2" title="Back to previous" aria-label="Back to previous"><ArrowLeft className="w-6 h-6" /></button>
              <div className="text-base sm:text-lg font-semibold text-white">Add Habit</div>
              <button type="submit" form="add-habit-form" className="flex items-center text-primary-500 font-semibold text-sm sm:text-base">
                Save <Check className="w-5 h-5 ml-1" />
              </button>
            </div>
            {/* Form */}
            <form id="add-habit-form" onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 px-3 sm:px-4 py-5 sm:py-6 flex-1 overflow-y-auto">
              {/* Title */}
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#181818] text-white placeholder-gray-400 rounded-xl px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border-none text-sm sm:text-base"
                placeholder="Enter Habit Title"
                required
              />
              {/* Description */}
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-[#181818] text-white placeholder-gray-400 rounded-xl px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border-none text-sm sm:text-base"
                placeholder="Enter Description (optional)"
              />
              {/* Color & Icon Row */}
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex-1 flex flex-col items-center">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-1"
                    style={{ background: color }}
                    title="Selected color preview"
                    aria-label="Selected color preview"
                    onClick={() => {
                      setShowColorPicker((prev) => !prev);
                      setShowIconGrid(false);
                    }}
                  ></button>
                  <span className="text-white text-xs sm:text-sm">Color</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-1 bg-[#222] border border-[#333]"
                    title="Selected icon preview"
                    aria-label="Selected icon preview"
                    onClick={() => {
                      setShowIconGrid((prev) => !prev);
                      setShowColorPicker(false);
                    }}
                  >
                    {(() => {
                      const IconComp = iconOptions.find(i => i.value === icon)?.icon;
                      return IconComp ? <IconComp className="w-6 h-6 text-white" /> : null;
                    })()}
                  </button>
                  <span className="text-white text-xs sm:text-sm">Icon</span>
                </div>
              </div>
              {showColorPicker && (
                <div className="mb-4 z-50">
                  <ChromePicker
                    color={color}
                    onChange={(c: ColorResult) => setColor(c.hex)}
                    disableAlpha
                  />
                </div>
              )}
              {/* Icon Grid */}
              {showIconGrid && (
                <div className="bg-[#181818] rounded-2xl p-3 sm:p-4 grid grid-cols-5 sm:grid-cols-6 gap-3 sm:gap-4 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {iconOptions.map(opt => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${icon === opt.value ? 'bg-[#333] border-2 border-orange-500' : 'bg-[#222] border border-[#222]'} transition-all`}
                        onClick={() => setIcon(opt.value)}
                        aria-label={opt.label}
                        title={opt.label}
                      >
                        <IconComp className="w-5 h-5 text-white" />
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Frequency Card */}
              <div className="bg-[#181818] rounded-2xl p-3 sm:p-4 mb-4">
                <div className="text-white font-semibold mb-2 text-sm sm:text-base">Frequency</div>
                <div className="flex flex-col space-y-2">
                  {frequencyOptions.map(opt => (
                    <label key={opt.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="frequencyType"
                        value={opt.value}
                        checked={frequencyType === opt.value}
                        onChange={() => setFrequencyType(opt.value)}
                        className="form-radio accent-orange-500 w-5 h-5"
                      />
                      <span className={`text-sm sm:text-base ${frequencyType === opt.value ? 'text-orange-400 font-semibold' : 'text-white'}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
                {/* Sub-options for frequency */}
                {frequencyType === 'weekdays' && (
                  <div className="flex space-x-2 overflow-x-auto mt-3 pb-1 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${daysOfWeek.includes(day) ? 'bg-orange-500 text-white' : 'bg-[#222] text-white'} transition-all`}
                        onClick={() => setDaysOfWeek(daysOfWeek.includes(day) ? daysOfWeek.filter(d => d !== day) : [...daysOfWeek, day])}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
                {frequencyType === 'monthdays' && (
                  <div className="flex space-x-2 overflow-x-auto mt-3 pb-1 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {monthDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        className={`px-3 py-2 rounded-lg font-medium text-xs sm:text-sm ${daysOfMonth.includes(day) ? 'bg-orange-500 text-white' : 'bg-[#222] text-white'} transition-all`}
                        onClick={() => setDaysOfMonth(daysOfMonth.includes(day) ? daysOfMonth.filter(d => d !== day) : [...daysOfMonth, day])}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
                {frequencyType === 'period' && (
                  <div className="flex items-center space-x-2 mt-3 pb-1">
                    <label htmlFor="daysPerPeriodInput" className="sr-only">Number of days per period</label>
                    <input
                      id="daysPerPeriodInput"
                      type="number"
                      min={1}
                      max={periodType === 'week' ? 7 : 31}
                      value={daysPerPeriod}
                      onChange={e => setDaysPerPeriod(Number(e.target.value))}
                      className="w-16 px-2 py-1 border rounded-lg bg-[#222] text-white text-xs sm:text-sm"
                      placeholder="Days"
                      title="Number of days per period"
                    />
                    <span className="text-white">days per</span>
                    <label htmlFor="periodTypeSelect" className="sr-only">Period type</label>
                    <select
                      id="periodTypeSelect"
                      value={periodType}
                      onChange={e => setPeriodType(e.target.value as 'week'|'month')}
                      className="border rounded-lg px-2 py-1 bg-[#222] text-white text-xs sm:text-sm"
                      title="Select period type"
                    >
                      <option value="week">week</option>
                      <option value="month">month</option>
                    </select>
                  </div>
                )}
              </div>
              {/* Checklist Section */}
              <div className="bg-[#181818] rounded-2xl px-4 py-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm sm:text-base">Checklist</span>
                  <label className="relative inline-flex items-center cursor-pointer ml-4" title="Checklist toggle">
                    <input type="checkbox" className="sr-only peer" checked={checklistEnabled} onChange={() => setChecklistEnabled(v => !v)} aria-label="Checklist toggle" />
                    <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checklistEnabled ? 'bg-yellow-400' : 'bg-[#222]'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ${checklistEnabled ? 'translate-x-5' : ''}`}></div>
                  </label>
                </div>
                {checklistEnabled && (
                  <div className="flex justify-center mt-2">
                    <button type="button" className="text-yellow-400 font-semibold flex items-center">
                      Add Checklist <span className="ml-1 text-lg">+</span>
                    </button>
                  </div>
                )}
              </div>
              {/* Set Reminder Section */}
              <div className="bg-[#181818] rounded-2xl px-4 py-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm sm:text-base">Set Reminder</span>
                  <label className="relative inline-flex items-center cursor-pointer ml-4" title="Reminder toggle">
                    <input type="checkbox" className="sr-only peer" checked={reminderEnabled} onChange={() => setReminderEnabled(v => !v)} aria-label="Reminder toggle" />
                    <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${reminderEnabled ? 'bg-yellow-400' : 'bg-[#222]'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ${reminderEnabled ? 'translate-x-5' : ''}`}></div>
                  </label>
                </div>
                {reminderEnabled && (
                  <>
                    <div className="flex items-center mb-3">
                      <span className="text-white mr-4">Time</span>
                      <label htmlFor="reminderTimeInput" className="sr-only">Reminder time</label>
                      <input
                        id="reminderTimeInput"
                        type="time"
                        value={reminderTime}
                        onChange={e => setReminderTime(e.target.value)}
                        className="bg-yellow-400 text-black font-semibold rounded-lg px-3 py-1 w-28 text-center focus:outline-none"
                        title="Reminder time"
                      />
                    </div>
                    <div>
                      <span className="text-white mr-4">Day</span>
                      <div className="flex space-x-2 mt-2 hide-scrollbar overflow-x-auto whitespace-nowrap" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {weekDays.map(day => (
                          <button
                            key={day}
                            type="button"
                            className={`min-w-[48px] px-4 py-2 rounded-lg font-medium text-xs sm:text-sm focus:outline-none transition-all ${reminderDays.includes(day) ? 'bg-yellow-400 text-black' : 'bg-[#222] text-white border border-yellow-400'}`}
                            onClick={() => setReminderDays(reminderDays.includes(day) ? reminderDays.filter(d => d !== day) : [...reminderDays, day])}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-100 text-red-700 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </form>
          </motion.div>
        </motion.div>
        <style>{hideScrollbarStyles}</style>
      </AnimatePresence>
    );
  };

export default AddHabitModal; 