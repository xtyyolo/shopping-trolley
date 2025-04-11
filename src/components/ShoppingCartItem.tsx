import React from 'react';
import { Checkbox, List, Typography } from 'antd';
import { Item } from './ShoppingCart'; 
 
const { Text } = Typography;
 
interface ShoppingCartItemProps {
  item: Item;
  onItemSelect: (itemId: number) => void;
  onRemoveItem: (itemId: number) => void;
  shouldShowRepetition: (item: Item) => boolean;
}
 
export const ShoppingCartItem: React.FC<ShoppingCartItemProps> = ({
  item,
  onItemSelect,
  onRemoveItem,
  shouldShowRepetition,
}) => {
  return (
    <List.Item className="shopping-cart-list-item">
      <Checkbox 
        className='shopping-cart-item-checkbox'
        checked={item.isSelected} 
        onChange={() => onItemSelect(item.id)} 
        disabled={item.auditStatus  === 'FAIL'}
      />
      <div className='shopping-cart-item-info-price'>
        <div className="shopping-cart-item-info">
          <div className={`shopping-cart-item-image-container ${item.auditStatus  === 'FAIL' ? 'disabled-item' : ''}`}>
            <img 
              className="shopping-cart-item-image"
              src={item.coverImage} 
              alt={item.title} 
            />
            {item.auditStatus  === 'FAIL' && (
              <div className="shopping-cart-item-image-overlay">已下架</div>
            )}
          </div>
          <div className="shopping-cart-item-details">
            <Text>{item.title}</Text><br  />
            <div className='shopping-cart-item-details-id-type'>
              <div className="shopping-cart-item-details-id">ID: {item.id}</div> 
              {item.softwareType  && (
                <div className="shopping-cart-item-details-type">类型: {item.softwareType}</div> 
              )}
            </div>
          </div>
        </div>
        {shouldShowRepetition(item) && (
          <div className='shopping-cart-item-repetition'>您已购买过此素材</div>
        )}
        <div className='shopping-cart-item-price'>
          <Text 
            className="shopping-cart-remove-button"
            onClick={() => onRemoveItem(item.id)} 
          >
            移除 
          </Text>
          <div className='shopping-cart-item-details-price-info'>
            <div className='shopping-cart-item-details-author'>
              {item.licType  === 'NP' ? '个人授权' : item.licType  === 'LP' ? '企业授权' : '企业PLUS'}
            </div>
            <div className='shopping-cart-item-details-price'>{item.price}</div> 
            <div className='shopping-cart-item-details-price-unit'>元</div>
          </div>
        </div>
      </div>
    </List.Item>
  );
};
 
export default ShoppingCartItem;