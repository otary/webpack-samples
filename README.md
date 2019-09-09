# webpack-samples


- [webpack-devserver-samples](./webpack-devserver-samples): 使用webpack-dev-server服务器
- [webpack-optimized-samples](./webpack-optimized-samples): 优化版


- [webpack-single-samples](./webpack-single-samples)：单项目示例
  - [webpack4-single-devserver-samples](./webpack-single-samples/webpack4-single-devserver-sample): 单项目
  

### 目录结构

```
-- src
 |-- assets  // 模块共有资源
 | |-- css
 | |-- js
 | |-- scss
 |-- pages   // 页面
 | |-- [模块1]
 | | |-- main.js    // 入口文件
 | | |-- template.html  // 模版文件
 | |-- [模块2]
 | | |-- main.js
 | | |-- template.html 

-- dist
 |-- assets   // 静态资源
 | |-- [模块名1]
 | | |-- js
 | | |-- css
 | |-- [模块名2]
 | | |-- js
 | | |-- css
 | |-- vendor  // 公共资源
 | | |-- js
 | | |-- css
 |-- views
 | |-- [模块名1]
 | | |-- index.html
 | |-- [模块名2]
 | | |-- index.html
 
```

---
## webpack-devserver-samples

### 运行

$ npm run server

> 查看webpack-dev-server服务器上的资源文件

http://localhost:9999/webpack-dev-server

> 访问页面

http://localhost:9999/views/home/index.html   
http://localhost:9999/views/home

http://localhost:9999/views/login/index.html    
http://localhost:9999/views/login

- vue + element-ui示例
http://localhost:9999/views/vue-server/index.html    
http://localhost:9999/views/vue-server

---
## webpack-optimized-samples



### 运行

> 生成dll文件并编译项目

$ npm run build:all
