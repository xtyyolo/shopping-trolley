import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// 开发环境启动（在应用入口文件）
if (import.meta.env.DEV)  {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({  onUnhandledRequest: 'bypass' });
  });
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
