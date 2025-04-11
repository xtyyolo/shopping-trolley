import React, { useState, useEffect } from 'react';
import './CustomDrawer.css';
import closeButtonImage from '../assets/close.png';
type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeButtonPosition: 'left' | 'right';
  width: string;
  children?: React.ReactNode; 
};
const CustomDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  closeButtonPosition,
  width,
  children 
}) => {
  const [isEscKeyDown, setIsEscKeyDown] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsDrawerVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsDrawerVisible(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEscKeyDown(true);
      }
    };

    const handleKeyUp = () => {
      if (isEscKeyDown) {
        onClose();
        setIsEscKeyDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEscKeyDown, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    isDrawerVisible && (
      <div className={`drawer-overlay ${isOpen ? 'drawer-overlay--visible' : ''}`} onClick={handleOverlayClick}>
        <div className={`drawer ${isOpen ? 'drawer--visible' : ''}`} style={{ width }}>
          <div className="drawer-header">
            {closeButtonPosition === 'left' && (
              <img src={closeButtonImage} className='drawer-close-button' alt="关闭" onClick={onClose} />
            )}
            <span className="drawer-title">{title}</span>
            {closeButtonPosition === 'right' && (
              <img src={closeButtonImage} className='drawer-close-button' alt="关闭" onClick={onClose} />
            )}
          </div>
          <div className="drawer-content">
            {children}
          </div>
        </div>
      </div>
    )
  );
};

export default CustomDrawer;