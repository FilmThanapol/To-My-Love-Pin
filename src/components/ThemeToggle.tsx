import React from 'react';

// Theme toggle completely disabled - light mode only for all platforms
interface ThemeToggleProps {
  isDark?: boolean;
  onToggle?: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  // Dark mode completely disabled for all platforms (computer, mobile, tablet, iPad)
  return null;
};

export default ThemeToggle;
