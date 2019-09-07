# webpack-samples


- [webpack-devserver-samples](./webpack-devserver-samples): 使用webpack-dev-server服务器



### 目录结构

```
-- src
 |-- assets  // 模块共有资源
 | |-- css
 | |-- js
 | |-- scss
 |-- pages   // 页面
 | |-- [模块1]
 | | |-- index.js    // 入口文件
 | | |-- template.html  // 模版文件
 | |-- [模块2]
 | | |-- index.js
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

### 运行

$ npm run server

> 查看webpack-dev-server服务器上的资源文件

http://localhost:9999/webpack-dev-server

> 访问页面

http://localhost:9999/views/home/index.html   
http://localhost:9999/views/home

http://localhost:9999/views/login/index.html    
http://localhost:9999/views/login