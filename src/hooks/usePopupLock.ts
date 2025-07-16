import { useState, useCallback } from 'react';

interface UsePopupLockReturn {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  togglePopup: () => void;
}

export const usePopupLock = (initialState: boolean = false): UsePopupLockReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openPopup = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePopup = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    openPopup,
    closePopup,
    togglePopup
  };
};
