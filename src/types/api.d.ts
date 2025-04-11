// 通用类型 
type EntityStatus = 'SUCCESS' | 'FAIL';
type LicenseType = 'NP' | 'LP' | 'LPPLUS';

 // 定义联合类型确保类型安全 
export type VideoSoftwareType = '视频素材' | 'AE模板' | 'C4D模版';
export type FotoSoftwareType = '图片素材' | 'AI模板' | 'PSD模版';


// 购物车基础接口 
interface CartItemBase {
  coverImage: string;
  price: number;
  title: string;
  licType: LicenseType;
  auditStatus: EntityStatus;
}

 
// 应用到接口 
export interface VideoCartItem extends CartItemBase {
  vid: number;
  softwareType: VideoSoftwareType; 
}
 
export interface FotoCartItem extends CartItemBase {
  fid: number;
  softwareType:FotoSoftwareType;
}
 
export interface MusicCartItem extends CartItemBase {
  mid: number;
}
 
// 购买记录 
export interface PurchaseRecord<T extends number> {
  licTypes: LicenseType[];
  fid?: T;
  mid?: T;
  vid?: T;
}
