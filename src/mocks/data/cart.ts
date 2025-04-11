import { faker } from '@faker-js/faker';
 import { VideoCartItem,MusicCartItem,FotoCartItem,LicenseType ,EntityStatus} from "../../types/api";
 const VIDEO_SOFTWARE_TYPES: Array<VideoCartItem['softwareType']> = [
  '视频素材',
  'AE模板',
  'C4D模版'
];
const FOTO_SOFTWARE_TYPES: Array<FotoCartItem['softwareType']> = [
  '图片素材',
  'AI模板',
  'PSD模版'
];
//视频素材
export const generateVideoCart = (count: number): VideoCartItem[] => {
    return Array.from({  length: count }, () => ({
      vid:faker.number.int({  min: 1111111, max: 9999999}),
      title: `${faker.helpers.arrayElement([' 宣传视频', '教程素材'])}-${faker.number.int({  min: 1000, max: 9999 })}`,
      coverImage: faker.image.urlLoremFlickr({ 
        category: 'business',
        width: 200,
        height: 100
      }),
      price: faker.number.int({  min: 99, max: 999 }),
      licType: faker.helpers.arrayElement<LicenseType>(['NP',  'LP', 'LPPLUS' ]),
      auditStatus: faker.helpers.arrayElement<EntityStatus>(['SUCCESS',  'FAIL']),
      softwareType: faker.helpers.arrayElement(VIDEO_SOFTWARE_TYPES)  
    }));
  };
  //图片素材
  export const generateFotosCart = (count: number): FotoCartItem[] => {
    return Array.from({  length: count }, () => ({
      fid: faker.number.int({  min: 1111111, max: 9999999}),
      title: `${faker.helpers.arrayElement([' 宣传图片', '教程图片'])}-${faker.number.int({  min: 1000, max: 9999 })}`,
      coverImage: faker.image.urlLoremFlickr({ 
        category: 'business',
        width: 200,
        height: 100
      }),
      price: faker.number.int({  min: 99, max: 999 }),
      licType: faker.helpers.arrayElement<LicenseType>(['NP',  'LP', 'LPPLUS']),
      auditStatus: faker.helpers.arrayElement<EntityStatus>(['SUCCESS',  'FAIL']),
      softwareType: faker.helpers.arrayElement(FOTO_SOFTWARE_TYPES)  
    }));
  };

 //音乐素材
 export const generateMusicCart = (count: number): MusicCartItem[] => {
  return Array.from({  length: count }, (_, i) => ({
    mid: i+1,
    title: `${faker.helpers.arrayElement([' 宣传音乐', '教程音乐'])}-${faker.number.int({  min: 1000, max: 9999 })}`,
    coverImage: faker.image.urlLoremFlickr({ 
      category: 'business',
      width: 200,
      height: 100
    }),
    price: faker.number.int({  min: 99, max: 999 }),
    licType: faker.helpers.arrayElement<LicenseType>(['LP']),//正常是'NP',  'LP', 'LPPLUS' 但是这里固定生成一个被重复购买的
    auditStatus: faker.helpers.arrayElement<EntityStatus>(['SUCCESS',  'FAIL']),
  }));
};


//视频购买记录
  export const mockVideoPurchases = faker.helpers.multiple(()  => ({
    vid: faker.number.int({  min: 1, max: 10 }),
    licTypes: faker.helpers.arrayElements<LicenseType>(['NP',  'LP', 'LPPLUS' ], { min: 1, max: 3 })
  }), { count: 5 });

  //图片购买记录
  export const mockFotoPurchases = faker.helpers.multiple(()  => ({
    fid: faker.number.int({  min: 1, max: 10 }),
    licTypes: faker.helpers.arrayElements<LicenseType>(['NP',  'LP', 'LPPLUS' ], { min: 1, max: 3 })
  }), { count:5 });
  
  //音乐购买记录-固定生成一个被提示重复购买的
  export const mockMusicPurchases = faker.helpers.multiple(()  => ({
    mid: faker.number.int({  min: 1, max: 1 }),
    licTypes: faker.helpers.arrayElements<LicenseType>(['LPPLUS' ], { min: 1, max: 1})
  }), { count: 1 });

