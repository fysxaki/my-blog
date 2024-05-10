# 一个有前后端的博客系统
技术栈为Vue3+Vite+Express+Naive UI+Axios。
## 功能实现:
1. 使用express框架构建服务端,使用snowflake算法生产id,避免id冲突的问题。
2. 使用axios封装请求，使用promise.all方法封装多个promise请求
3. 实现分类表，博客表的增删改查。（使用了sql语句）
4. 引用token，验证token来进入后台，使用中间拦截器验证登录
5. 前端实现文章的增删改查。（基本的js逻辑）
6. 通过后端提供的接口，实现文章详情及文章简略信息的展示
7. 通过时间库moment.js及js自带对象Date实现发布时间和修改时间的详细记录。
## 亮点如下：
1. 使用雪花算法生成唯一的id。,使用SQLite数据库，并使用HeidiSql进行数据库管理。
2. 实现了登录注册功能，以及基本的增删改查功能，引入Axios来进行网络请求管理。
3. 使用wangEditor来实现文本编辑功能，使用moment.js来管理时间状态。
4. 在全局请求配置中，通过import.meta.env.BASE_URL环境变量区分本地和生产环境发送的请求域名，能够根据项目启
动命令自动区分多环境。
