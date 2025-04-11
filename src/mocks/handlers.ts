import { http, HttpResponse, delay } from 'msw';
import { 
    generateVideoCart,
    generateFotosCart,
    generateMusicCart,
    mockVideoPurchases,
    mockFotoPurchases,
    mockMusicPurchases
} from './data/cart';
 
const API_PREFIX = '/vjh';
 
export const handlers = [
  // 1. 视频购物车接口
  http.get(`${API_PREFIX}/buyer/cart/videos`,  async () => {
    await delay(200) 
    return HttpResponse.json({  
      data: generateVideoCart (5)// 控制生成的个数
    });
  }),
   // 2. 图片购物车接口
   http.get(`${API_PREFIX}/buyer/cart/fotos`,  async () => {
    await delay(200)  
    return HttpResponse.json({  
      data: generateFotosCart (12)
    });
  }),
    // 3. 音乐购物车接口
    http.get(`${API_PREFIX}/buyer/music/musics`,  async () => {
      await delay(200) 
      return HttpResponse.json({  
        data: generateMusicCart (1)//固定生成一个被重复购买的
      });
    }),
  // 4. 视频购买记录接口
  http.get(`${API_PREFIX}/video/download/lic-types-bought`,  async ({ request }) => {
    const url = new URL(request.url); 
    const vids = url.searchParams.getAll('vids').map(Number); 

    
    const records = mockVideoPurchases.filter((p:  any) => 
      'vid' in p && vids.includes(p.vid) 
    );
    return HttpResponse.json({  
      data: records 
    });
  }),
   // 5. 图片购买记录接口
   http.get(`${API_PREFIX}/foto/download/lic-types-bought`,  async ({ request }) => {
    const url = new URL(request.url); 
    const fids = url.searchParams.getAll('fids').map(Number); 
    const records = mockFotoPurchases.filter((p:  any) => 
      'fid' in p && fids.includes(p.fid) 
    );
    return HttpResponse.json({  
      data: records 
    });
  }),
   // 6. 音乐购买记录接口
   http.get(`${API_PREFIX}/music/download/lic-types-bought`,  async ({ request }) => {
    const url = new URL(request.url); 
    const mids = url.searchParams.getAll('mids').map(Number); 
    const records = mockMusicPurchases.filter((p:  any) => 
      'mid' in p && mids.includes(p.mid) 
    );

    return HttpResponse.json({  
      data: records 
    });
  }),
];

