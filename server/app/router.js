'use strict';

module.exports = app => {
  // 模型添加字段同步数据库
  app.beforeStart(async () => {
    await app.model.sync({});// force  false 为不覆盖 true会删除再创建; alter true可以 添加或删除字段;
  });
  // 加载路由文件
  require('./router/system')(app);
  // require('./router/socket')(app); // 开启之后需要连接 有超时阻塞
};
