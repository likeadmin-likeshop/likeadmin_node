module.exports = app => {
    const {router, controller} = app;
    router.all('/api/system/login', controller.system.login);
    router.all('/api/system/admin/self', controller.system.self);
};
