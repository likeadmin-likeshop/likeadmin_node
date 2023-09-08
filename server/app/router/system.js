module.exports = app => {
    const { router, controller } = app;
    router.all('/api/system/login', controller.system.login);
    router.all('/api/system/menu/route', controller.system.menusRoute);
    router.all('/api/common/index/console', controller.system.console);
    router.all('/api/common/index/config', controller.system.configInfo);
    
    // 部门管理
    router.all('/api/system/dept/list', controller.system.dept.deptList);
    router.all('/api/system/dept/add', controller.system.dept.deptAdd);
    router.all('/api/system/dept/detail', controller.system.dept.deptDetail);
    router.all('/api/system/dept/edit', controller.system.dept.deptEdit);
    router.all('/api/system/dept/del', controller.system.dept.deptDel);
    router.all('/api/system/dept/all', controller.system.dept.deptAll);

    // 岗位管理
    router.all('/api/system/post/list', controller.system.post.postList);
    router.all('/api/system/post/add', controller.system.post.postAdd);
    router.all('/api/system/post/detail', controller.system.post.postDetail);
    router.all('/api/system/post/edit', controller.system.post.postEdit);
    router.all('/api/system/post/del', controller.system.post.postDel);
    router.all('/api/system/post/all', controller.system.post.postAll);

    // 管理员
    router.all('/api/system/admin/list', controller.system.admin.adminList);
    router.all('/api/system/admin/self', controller.system.admin.self);
    router.all('/api/system/admin/add', controller.system.admin.add);
    router.all('/api/system/admin/detail', controller.system.admin.detail);
    router.all('/api/system/admin/edit', controller.system.admin.edit);
    router.all('/api/system/admin/upInfo', controller.system.admin.update);
    router.all('/api/system/admin/del', controller.system.admin.del);
    router.all('/api/system/admin/disable', controller.system.admin.disable);

    // 角色管理
    router.all('/api/system/role/all', controller.system.role.roleAll);
    router.all('/api/system/role/list', controller.system.role.roleList);
    router.all('/api/system/role/detail', controller.system.role.detail);
    router.all('/api/system/role/add', controller.system.role.add);
    router.all('/api/system/role/edit', controller.system.role.edit);
    router.all('/api/system/role/del', controller.system.role.del);

    router.all('/api/system/menu/list', controller.system.menuList);
};
