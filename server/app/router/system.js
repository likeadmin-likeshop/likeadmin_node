module.exports = app => {
    const {router, controller} = app;
    router.all('/api/system/login', controller.system.login);
    router.all('/api/system/admin/self', controller.system.self);
    router.all('/api/system/menu/route', controller.system.menusRoute);
    router.all('/api/common/index/console', controller.system.console);
    router.all('/api/common/index/config', controller.system.configInfo);
};
