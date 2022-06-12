module.exports = {
    env: {
        node: true,
    },
    extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
    rules: {
        // override/add rules settings
        // 'vue/no-unused-vars': 'error'
        "vue/require-default-prop": "off",
    },
};
