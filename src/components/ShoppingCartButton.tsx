import React from 'react';
import car from '../assets/car.png';
import './ShoppingCartButton.css';
interface ShoppingCartButtonProps {
  cartCount: number;
  openDrawer: () => void;
}

const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({ cartCount, openDrawer }) => {
  return (
    <div className='car-btn' onClick={openDrawer}>
      <div className='car-num'>{cartCount}</div>
      <img src={car} className='car-img' alt='购物车' />
    </div>
  );
};

export default ShoppingCartButton;
