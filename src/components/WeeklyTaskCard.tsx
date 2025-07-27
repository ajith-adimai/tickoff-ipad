import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Plus, Calendar } from 'lucide-react';

interface Task {
  id: string;
  day: string;
  description: string;
  completed: boolean;
}

interface WeeklyTaskCardProps {
  className?: string;
}

const WeeklyTaskCard: React.FC<WeeklyTaskCardProps> = ({ className = "" }) => {
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', day: 'Mon', description: 'Start new project research', completed: false },
    { id: '2', day: 'Tue', description: 'Outline project proposal', completed: false },
    { id: '3', day: 'Wed', description: 'Team sync meeting', completed: false },
    { id: '4', day: 'Thu', description: 'Develop initial mockups', completed: false },
    { id: '5', day: 'Fri', description: 'Prepare for client demo', completed: false },
  ]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const weeks = [1, 2, 3, 4];

  const handleTaskAction = (taskId: string, action: 'complete' | 'reject') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: action === 'complete' }
          : task
      )
    );
  };

  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        day: 'Mon', // Default to Monday, could be made dynamic
        description: newTaskDescription.trim(),
        completed: false,
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskDescription('');
      setShowAddTask(false);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#232b3b] rounded-2xl shadow-lg p-4 md:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-white">Weekly Tasks</h3>
            <p className="text-xs md:text-sm lg:text-base text-gray-400">
              {completedTasks} of {totalTasks} completed
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddTask(true)}
          className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          title="Add new task"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
        </motion.button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto hide-scrollbar">
        {weeks.map((week) => (
          <motion.button
            key={week}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedWeek(week)}
            className={`px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full text-xs md:text-sm lg:text-base font-medium transition-all duration-200 whitespace-nowrap ${
              selectedWeek === week
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Week {week}
          </motion.button>
        ))}
      </div>

      {/* Add Task Input */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 md:p-4 bg-gray-800/50 rounded-xl border border-gray-700"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Enter task description..."
                className="flex-1 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTask}
                className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm md:text-base rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Add
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskDescription('');
                }}
                className="px-3 py-2 md:px-4 md:py-3 bg-gray-600 text-gray-300 text-sm md:text-base rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-between p-2.5 md:p-3 lg:p-4 rounded-xl transition-all duration-200 ${
              task.completed 
                ? 'bg-green-900/30 border border-green-600/50' 
                : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50'
            }`}
          >
            {/* Day and Description */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className={`text-xs md:text-sm lg:text-base font-semibold min-w-[2rem] md:min-w-[2.5rem] lg:min-w-[3rem] ${
                task.completed ? 'text-green-400' : 'text-gray-300'
              }`}>
                {task.day}
              </span>
              <span className={`text-xs md:text-sm lg:text-base truncate ${
                task.completed ? 'text-green-300 line-through' : 'text-gray-200'
              }`}>
                {task.description}
              </span>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 md:space-x-3 ml-2 md:ml-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTaskAction(task.id, 'complete')}
                className={`transition-all duration-200 ${
                  task.completed
                    ? 'text-green-500'
                    : 'text-gray-400 hover:text-green-500'
                }`}
                title="Mark as complete"
              >
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTaskAction(task.id, 'reject')}
                className="text-gray-400 hover:text-red-500 transition-all duration-200"
                title="Mark as rejected"
              >
                <XCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-6 md:py-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-500" />
          </div>
          <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-400 mb-1 md:mb-2">No tasks for this week</h3>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base">Add some tasks to get started</p>
        </div>
      )}

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mt-3 md:mt-4 lg:mt-6 pt-3 md:pt-4 lg:pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs md:text-sm lg:text-base text-gray-400 mb-2 md:mb-3">
            <span>Progress</span>
            <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 md:h-2 lg:h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 md:h-2 lg:h-3 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyTaskCard; 