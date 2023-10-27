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

    // 菜单管理
    router.all('/api/system/menu/list', controller.system.menu.menuList);
    router.all('/api/system/menu/detail', controller.system.menu.menuDetail);
    router.all('/api/system/menu/add', controller.system.menu.menuAdd);
    router.all('/api/system/menu/edit', controller.system.menu.menuEdit);
    router.all('/api/system/menu/del', controller.system.menu.menuDel);

    // 素材管理
    router.all('/api/common/album/cateList', controller.common.album.cateList);
    router.all('/api/common/album/cateAdd', controller.common.album.cateAdd);
    router.all('/api/common/album/cateRename', controller.common.album.cateRename);
    router.all('/api/common/album/cateDel', controller.common.album.cateDel);
    router.all('/api/common/album/albumList', controller.common.album.albumList);
    router.all('/api/common/album/albumRename', controller.common.album.albumRename);
    router.all('/api/common/album/albumDel', controller.common.album.albumDel);
    router.all('/api/common/album/albumAdd', controller.common.album.albumAdd);
    router.all('/api/common/album/albumMove', controller.common.album.albumMove);

    // 上传
    router.all('/api/common/upload/image', controller.common.album.uploadImage);
    router.all('/api/common/upload/video', controller.common.album.uploadVideo);

    // 网站信息
    router.all('/api/setting/website/detail', controller.setting.website.details);
    router.all('/api/setting/website/save', controller.setting.website.save);
    router.all('/api/setting/copyright/detail', controller.setting.copyright.details);
    router.all('/api/setting/copyright/save', controller.setting.copyright.save);
    router.all('/api/setting/protocol/detail', controller.setting.protocol.details);
    router.all('/api/setting/protocol/save', controller.setting.protocol.save);
    router.all('/api/setting/storage/list', controller.setting.storage.list);
    router.all('/api/setting/storage/detail', controller.setting.storage.detail);
    router.all('/api/setting/storage/edit', controller.setting.storage.edit);
    router.all('/api/setting/storage/change', controller.setting.storage.change);
    router.all('/api/monitor/server', controller.monitor.monitor.server);
    router.all('/api/monitor/cache', controller.monitor.monitor.cache);

    // 日志管理
    router.all('/api/system/log/operate', controller.system.log.operate);

    // 字典管理
    router.all('/api/setting/dict/type/list', controller.setting.dict.list);
    router.all('/api/setting/dict/type/all', controller.setting.dict.all);
    router.all('/api/setting/dict/type/add', controller.setting.dict.add);
    router.all('/api/setting/dict/type/detail', controller.setting.dict.detail);
    router.all('/api/setting/dict/type/edit', controller.setting.dict.edit);
    router.all('/api/setting/dict/type/del', controller.setting.dict.del);
    router.all('/api/setting/dict/data/list', controller.setting.dict.dataList);
    router.all('/api/setting/dict/data/all', controller.setting.dict.dataAll);
    router.all('/api/setting/dict/data/detail', controller.setting.dict.dataDetail);
    router.all('/api/setting/dict/data/add', controller.setting.dict.dataAdd);
    router.all('/api/setting/dict/data/edit', controller.setting.dict.dataEdit);
    router.all('/api/setting/dict/data/del', controller.setting.dict.dataDel);

    router.all('/api/gen/list', controller.gen.gen.list);
    router.all('/api/gen/db', controller.gen.gen.dbTables);
    router.all('/api/gen/importTable', controller.gen.gen.importTable);

};
