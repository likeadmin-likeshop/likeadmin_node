module.exports = app => {
    const {router, controller} = app;
    router.all('/{{ toCamelCase(entityName) }}/list', controller.{{ toCamelCase(entityName) }}.list);
    router.all('/{{ toCamelCase(entityName) }}/add', controller.{{ toCamelCase(entityName) }}.add);
    router.all('/{{ toCamelCase(entityName) }}/detail', controller.{{ toCamelCase(entityName) }}.detail);
    router.all('/{{ toCamelCase(entityName) }}/edit', controller.{{ toCamelCase(entityName) }}.edit);
    router.all('/{{ toCamelCase(entityName) }}/del', controller.{{ toCamelCase(entityName) }}.del);
};