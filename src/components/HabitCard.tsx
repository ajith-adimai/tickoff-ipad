import React, { useState, useEffect } from 'react';
import { Habit, supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Trash2, Edit } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
  selectedDate: Date;
  onUpdate: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, selectedDate, onUpdate }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    checkCompletionStatus();
  }, [selectedDate, habit.id]);

  const checkCompletionStatus = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      console.log('Checking completion for habit:', habit.id, 'date:', dateString);
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habit.id)
        .eq('date', dateString);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Completion data:', data);
      setIsCompleted(data && data.length > 0);
    } catch (error) {
      console.error('Error checking completion status:', error);
      // Don't throw the error, just log it to avoid breaking the UI
    }
  };

  const toggleCompletion = async () => {
    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .eq('date', dateString);
        
        if (error) throw error;
        setIsCompleted(false);
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habit.id,
            user_id: habit.user_id,
            date: dateString,
            completed_at: new Date().toISOString(),
          });
        
        if (error) throw error;
        setIsCompleted(true);
      }
      
      onUpdate();
    } catch (error) {
      console.error('Error toggling completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async () => {
    // if (!confirm('Are you sure you want to delete this habit?')) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habit.id);
      
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  return (
    <motion.div
      layout
      className="habit-card"
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCompletion}
            disabled={loading}
            className={`habit-button ${isCompleted ? 'completed' : ''} ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </motion.button>

          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className={`text-sm ${
                isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {habit.description}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {getFrequencyText(habit.frequency)}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit habit"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteHabit}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete habit"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HabitCard; 