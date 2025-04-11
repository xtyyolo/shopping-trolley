import React from 'react';
import './NoDataPlaceholder.css';
import search from '../assets/search.png'
const NoDataPlaceholder: React.FC = () => {
  return (
    <div className="no-data-placeholder">
      <img
        src={search} 
        alt="No data"
        className="no-data-image"
      />
      <p className="no-data-text">暂无数据</p>
    </div>
  );
};

export default NoDataPlaceholder;