import React, { useState } from 'react';
import CustomDrawer from './components/CustomDrawer';
import ShoppingCart from './components/ShoppingCart';
import ShoppingCartButton from './components/ShoppingCartButton';
import './App.css'; 

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const updateCartCount = (newCount: number) => {
    setCartCount(newCount);
  };

  return (
    <>
      <ShoppingCartButton cartCount={cartCount} openDrawer={openDrawer} />
      <CustomDrawer 
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="购物车"
        closeButtonPosition="right"
        width="540px"
      >
        <ShoppingCart updateCartCount={updateCartCount} />
      </CustomDrawer>
    </>
  );
};

export default App;