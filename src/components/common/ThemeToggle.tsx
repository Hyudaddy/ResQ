import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-dark-800 dark:hover:bg-dark-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-dark-300 hover:text-dark-100" />
      ) : (
        <Moon size={20} className="text-dark-600 hover:text-dark-800" />
      )}
    </button>
  );
};

export default ThemeToggle;