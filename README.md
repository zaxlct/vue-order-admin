# order-admin

> 用 Vue 全家桶搭建的商品订单管理后台系统

## 本地启动项目
```bash
npm install
npm start
```
- 测试账号/密码：test/1

## 技术栈
- Vue 2.0
- vue-router
- Vuex
- Axios
- Element-UI
- ES6 && ES7
- Sass

## 网站功能
主要是对订单和商品的管理，所以项目分为订单和商品两个部分
### 一. 订单
##### 订单列表页
- 展示订单列表，并分页
- 搜索订单功能
- 添加订单功能
##### 订单详情页 
- 给订单添加/修改备注功能
- 删除订单里的商品功能
- 增加/减少订单里的某个商品数量和利润，并动态计算总额
- 第三方商品的增删改查/上传图片功能
### 二. 商品
##### 商品列表页
- 点击商品菜单动态展示商品
- 搜索商品/按颜色筛选商品
- 商品分页
- 指定商品选择不同颜色功能
- 添加商品到订单功能
##### 商品详情页 
- 商品详情展示
- 商品评论的增删改查/上传图片功能/商品评分功能


## 网站部分展示
### 订单列表页
![订单列表](https://github.com/zaxlct/vue-order-admin/blob/master/imgs/order-list.jpg)

### 订单详情页
![订单详情](https://github.com/zaxlct/vue-order-admin/blob/master/imgs/order-detail.jpg)

### 商品列表页
![商品列表](https://github.com/zaxlct/vue-order-admin/blob/master/imgs/goods-list.png)

### 商品详情页
![商品详情](https://github.com/zaxlct/vue-order-admin/blob/master/imgs/goods-detail.jpg)

### 编辑商品页
![编辑商品](https://github.com/zaxlct/vue-order-admin/blob/master/imgs/edit-goods.jpg)



