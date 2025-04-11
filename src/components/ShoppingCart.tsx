import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Checkbox, List, Divider, Tabs, ConfigProvider, Skeleton } from 'antd';
import NoDataPlaceholder from './NoDataPlaceholder';
import './ShoppingCart.css';   
import { ShoppingCartItem } from './ShoppingCartItem';
 
type MediaType = 'video' | 'music' | 'image';
type LicenseType = 'NP' | 'LP' | 'LPPLUS' | '企业PLUS';
type AuditStatus = 'FAIL' | string;
 
interface BaseItem {
  id: number;
  title: string;
  coverImage: string;
  price: number;
  licType: LicenseType;
  auditStatus: AuditStatus;
  softwareType?: string;
}
 
export interface Item extends BaseItem {
  type: MediaType;
  isSelected: boolean;
}
 
interface PurchaseRecord {
  vid?: number;
  fid?: number;
  mid?: number;
  licTypes: LicenseType[];
}
 
const API_PREFIX = '/vjh';
 
interface ShoppingCartProps {
  updateCartCount: (newCount: number) => void;
}
 
const ShoppingCart: React.FC<ShoppingCartProps> = ({ updateCartCount }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);
  const [activeTab, setActiveTab] = useState<MediaType>('video');
  const [localItems, setLocalItems] = useState<Item[]>([]);
  const [showContent, setShowContent] = useState(false);
 
  // 请求列表函数
  const fetchData = async (url: string) => {
    const response = await fetch(url);
    return response.json();  
  };
 //请求重复购买记录
  const fetchPurchaseRecords = async (type: string, typeIds: string, ids: string[]) => {
    const queryString = ids.map((id)   => `${typeIds}=${id}`).join('&');
    const response = await fetch(`${API_PREFIX}/${type}/download/lic-types-bought?${queryString}`);
    const data = await response.json();  
    return data.data;  
  };
 
  // 请求数据并处理
  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now(); 
      setIsLoading(true);
      try {
        // 列表数据请求 
        const [videoData, imageData, musicData] = await Promise.all([  
          fetchData(`${API_PREFIX}/buyer/cart/videos`),
          fetchData(`${API_PREFIX}/buyer/cart/fotos`),
          fetchData(`${API_PREFIX}/buyer/music/musics`),
        ]);
 
        const allData = [...videoData.data,  ...musicData.data,  ...imageData.data];  
        setRawItems(allData);
 
        // 购买记录请求 
        const allPurchaseRecords = await Promise.all([  
          videoData.data.length  > 0 ? fetchPurchaseRecords('video', 'vids', videoData.data.map((item:  { vid: string }) => item.vid))  : [],
          musicData.data.length  > 0 ? fetchPurchaseRecords('music', 'mids', musicData.data.map((item:  { mid: string }) => item.mid))  : [],
          imageData.data.length  > 0 ? fetchPurchaseRecords('foto', 'fids', imageData.data.map((item:  { fid: string }) => item.fid))  : [],
        ]);
        
        setPurchaseRecords(allPurchaseRecords.flat());  
      } catch (error) {
        console.error(' 数据请求出错:', error);
      } finally {
        const elapsed = Date.now()  - startTime;
        const minLoadTime = 300; // 设置加载的时间
        
        if (elapsed < minLoadTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
        }
        
        setIsLoading(false);
        setShowContent(true);
      }
    };
 
    loadData();
  }, []);
 
  // 数据转换和处理
  useEffect(() => {
    if (rawItems.length  > 0) {
      const converted = rawItems.map(item  => {
        let id: number;
        if ('vid' in item) id = item.vid;   
        else if ('fid' in item) id = item.fid;   
        else if ('mid' in item) id = item.mid;   
        else id = item.id;   
 
        let type: MediaType = 'video';
        if (item.title?.includes('图片')) type = 'image';
        else if (item.title?.includes('音乐')) type = 'music';
 
        let price = item.price;   
        if (item.licType  === 'LP') price = item.price  * 4;
        else if (item.licType  === '企业PLUS') price = item.price  * 10;
 
        return {
          ...item,
          id,
          type,
          price,
          isSelected: false 
        };
      });
      updateCartCount(converted.length); 
      setLocalItems(converted);
    }
  }, [rawItems]);
 
  // 计算每一个类型项目的数量
  const itemCounts = useMemo(() => {
    return {
      video: localItems.filter(item  => item.type  === 'video').length,
      music: localItems.filter(item  => item.type  === 'music').length,
      image: localItems.filter(item  => item.type  === 'image').length,
    };
  }, [localItems]);
 
  // Tab
  const tabsItems = useMemo(() => [
    { key: 'video', label: `视频 ${itemCounts.video}`  },
    { key: 'image', label: `图片 ${itemCounts.image}`  },
    { key: 'music', label: `音乐 ${itemCounts.music}`  },
  ], [itemCounts]);
 
  // 当前tabs的过滤项
  const filteredItems = useMemo(() => 
    localItems.filter(item  => item.type  === activeTab), 
    [localItems, activeTab]
  );
 
  // 当前是否全选
  const isAllSelectedMap = useMemo(() => {
    const result = { video: false, music: false, image: false };
    for (const type of ['video', 'music', 'image'] as const) {
      const typeItems = localItems.filter(item  => 
        item.type  === type && item.auditStatus  !== 'FAIL'
      );
      result[type] = typeItems.length  > 0 && typeItems.every(i  => i.isSelected);   
    }
    return result;
  }, [localItems]);
 
  // Tab改变 
  const handleTabChange = useCallback((key: string) => {
    if (['video', 'music', 'image'].includes(key)) {
      setActiveTab(key as MediaType);
    }
  }, []);
 
  // 全选按钮 
  const handleSelectAll = useCallback(() => {
    const selectableItems = filteredItems.filter(item  => item.auditStatus  !== 'FAIL');
    if (selectableItems.length  === 0) return;
    const newIsAllSelected = !isAllSelectedMap[activeTab];
    setLocalItems(prevItems =>
      prevItems.map(item  => {
        if (item.type  === activeTab && item.auditStatus  !== 'FAIL') {
          return { ...item, isSelected: newIsAllSelected };
        }
        return item;
      })
    );
  }, [activeTab, filteredItems, isAllSelectedMap]);
 
  // 单个复选框处理 
  const handleItemSelect = useCallback((itemId: number) => {
    setLocalItems(prevItems => {
      const newItems = prevItems.map(item  =>
        item.id  === itemId ? { ...item, isSelected: !item.isSelected  } : item 
      );
      return newItems;
    });
  }, []);
 
  // 移除项目 
  const handleRemoveItem = useCallback((itemId: number) => {
    setLocalItems(prevItems => {
      const newItems = prevItems.filter(item  => item.id  !== itemId);
      const newCount = newItems.length; 
      updateCartCount(newCount);
      return newItems;
    });
  }, [updateCartCount]);
 
  // 购买按钮 
  const handleBuyNow = useCallback(() => {
    const selectedItems = filteredItems.filter(item  => item.isSelected);   
    const totalPrice = selectedItems.reduce((total,  item) => total + item.price,  0);
    
    selectedItems.forEach(item  => {
      console.log(` 购买的物品: ${item.title},  ID: ${item.id},  价格: ￥${item.price}`);   
    });
    console.log(` 总价格: ￥${totalPrice}`);
  }, [filteredItems]);
 
  // 计算总价格和选定的计数 
  const { totalPrice, selectedCount } = useMemo(() => {
    const selected = filteredItems.filter(item  => item.isSelected);   
    return {
      totalPrice: selected.reduce((total,  item) => total + item.price,  0),
      selectedCount: selected.length    
    };
  }, [filteredItems]);
 
  const hasSelectedItems = selectedCount > 0;
 
  // 检查重复购买 
  const shouldShowRepetition = useCallback((item: Item) => {
    const sameTypeRecords = purchaseRecords.filter(record  => {
      const recordId = record.vid  || record.fid  || record.mid;   
      return record.licTypes.includes(item.licType)  && recordId === item.id;   
    });
    
    if (sameTypeRecords.length  > 0) return true;
    // 购买过LPPLUS，当前是购买LP，就提示
    if (item.licType  === 'LP' && purchaseRecords.some(r  => r.licTypes.includes('LPPLUS')))  {
      return true;
    }
    return false;
  }, [purchaseRecords]);
 
  // 骨架屏 
  const skeletonItems = Array(3).fill(0).map((_, index) => (
    <div key={index} className="skeleton-item">
      <Skeleton.Avatar active size="large" shape="square" />
      <div className="skeleton-content">
        <Skeleton.Input active block style={{ width: '60%', marginBottom: 12 }} />
        <Skeleton.Input active block style={{ width: '40%' }} size="small" />
      </div>
      <Skeleton.Button active shape="round" style={{ width: 100 }} />
    </div>
  ));
 
  return (
    <ConfigProvider 
      theme={{
        components: {
          Tabs: {
            inkBarColor: '#0d0d0d',
            itemSelectedColor: '#0d0d0d',
            itemColor: '#888888',
            itemHoverColor: '#404040',
            verticalItemMargin: '16px 30px',
            horizontalItemPaddingLG: '16px 4px',
            horizontalMargin: '0px 0px 0px 40px',
          },
          Button: {
            colorPrimary: '#0d0d0d',
            contentFontSize: 16,
            defaultBg: '#cccccc',
            borderColorDisabled: '#cccccc',
            fontWeight: 500,
            solidTextColor: '#FEFEFE',
          }
        },
      }}
    >
      <div className="shopping-cart">
        <Tabs 
          className="shopping-cart-tabs"
          activeKey={activeTab}
          items={tabsItems}
          size='large'
          indicator={{ size: 54 }}
          tabBarStyle={{ justifyContent: 'center' }}
          onChange={handleTabChange}
        />
        
        <div className={`shopping-cart-list-container ${showContent ? 'visible' : ''}`}>
          {isLoading ? (
            <div className="skeleton-container">
              {skeletonItems}
            </div>
          ) : filteredItems.length  === 0 ? (
            <NoDataPlaceholder />
          ) : (
            <List 
              dataSource={filteredItems}
              className="shopping-cart-list"
              split={false}
              renderItem={(item) => (
                <ShoppingCartItem 
                  item={item}
                  onItemSelect={handleItemSelect}
                  onRemoveItem={handleRemoveItem}
                  shouldShowRepetition={shouldShowRepetition}
                />
              )}
            />
          )}
        </div>
        
        {!isLoading && (
          <>
            <Divider className="shopping-cart-divider" />
            
            <div className="shopping-cart-footer">
              <div className='shopping-cart-footer-top'>
                <Checkbox 
                  checked={isAllSelectedMap[activeTab]} 
                  onChange={handleSelectAll}
                >
                  全选 
                </Checkbox>
                <div className="shopping-cart-total-price">
                  <div className='shopping-cart-total-price-selected'>已选 {selectedCount}件</div>
                  <div className='shopping-cart-total-price-total'>
                    <div>总计:</div>
                    <div className='shopping-cart-total-price-total-num'>{totalPrice}</div>
                    <div className='shopping-cart-total-price-total-unit'>元</div>
                  </div>
                </div>
              </div>
              <button 
                className={hasSelectedItems ? "shopping-cart-buy-button-active" : "shopping-cart-buy-button-disabled"}
                disabled={!hasSelectedItems}
                onClick={handleBuyNow}
              >
                立即购买 
              </button>
            </div>
          </>
        )}
      </div>
    </ConfigProvider>
  );
};
 
export default ShoppingCart;