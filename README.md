# 购物车项目文档

## 一、运行环境
### 本地运行
本机运行环境要求 Node.js 版本为 18.17.0。请确保你的开发环境已经安装了该版本的 Node.js，以保证项目的正常运行。

## 二、注意事项
### 模拟数据
- 项目中的模拟数据是随机生成的。在音乐类数据中，仅生成了一个示例数据，用于展示重复购买的情况。
- 购物车接口返回的数量是固定值。若需要修改该数量，可以在 `mocks-handlers.tsx` 文件的第 18 行、25 行和 32 行进行调整。

## 三、项目搭建与运行
### 安装依赖
在项目根目录下，打开终端并执行以下命令来安装项目所需的依赖：
```bash
npm i or pnpm i
```
2. 运行
```
npm run dev or pnpm run dev
```

## 项目主要结构
shopping-trolley/
├── src/
│   ├── assets // 静态资源目录，用于存放图片、字体等资源
│   ├── components/
│   │   ├── CustomDrawer.tsx  // 自定义抽屉组件，用于实现特定的抽屉功能
│   │   ├── NoDataPlaceholder.tsx // 无数据占位组件，在数据为空时显示提示信息
│   │   ├── ShoppingCart.tsx // 购物车主组件，包含购物车的核心逻辑和展示
│   │   ├── ShoppingCartButton.tsx // 购物车按钮组件，用于触发购物车的显示与隐藏
│   │   ├── ShoppingCartItem.tsx // 购物车商品组件，展示单个商品的信息
│   ├── mocks // 模拟数据目录，用于开发环境下的数据模拟
│   │   ├── data
│   │   │   ├── cart.ts // 购物车数据模拟文件，提供购物车相关的模拟数据
│   │   ├── browser.ts
│   │   ├── faker.setup
│   │   ├── handlers.ts // 接口处理文件，模拟接口请求的响应
│   ├── types // 类型定义目录，存放项目中使用的类型定义文件
│   ├── App.tsx // 主应用组件，作为项目的入口组件
│   ├── index.tsx // 入口文件，负责项目的初始化和渲染
├── package.json // 项目依赖和脚本配置文件
├── tsconfig.json // TypeScript 配置文件
├── README.md // 项目说明文档
