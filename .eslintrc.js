module.exports = {
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended'
    ],
    env: {
        node: true,
        browser: true,
        commonjs: true,
        es6: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6, // 指定要使用的ECMAScript6版本
        sourceType: 'module',
        ecmaFeatures: { 'jsx': true } //启用JSX
    },

    plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],

    settings: {
        react: {
          pragma: "React",
          version: "detect"
        }
    },

    rules: {
        'arrow-parens': ['error', 'as-needed'], // 箭头函数参数只有一个时，可以省略参数的括号，否则error提示

        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境中不允许使用debugger

        'no-console': 'off', // 允许使用console

        'no-unused-vars': 'off', // 由ts处理

        'react/jsx-no-target-blank': 'off', // a链接允许直接使用_blank

        'prettier/prettier': 'warn', // 对于prettier报错进行warn提醒

        'jsx-a11y/anchor-has-content': 'off',

        "react-hooks/rules-of-hooks": "error",

        "react-hooks/exhaustive-deps": "warn",

        "react/prop-types": 'off',

        '@typescript-eslint/no-explicit-any': 'off', // 允许使用any

        "@typescript-eslint/interface-name-prefix": "off", // 允许interface定义以I开头

        "@typescript-eslint/no-var-requires": "off",

        '@typescript-eslint/no-unused-vars': ['error', {
            vars: 'all',
            args: 'none',
            ignoreRestSiblings: true
        }],

        // 函数不必声明返回类型
        '@typescript-eslint/explicit-function-return-type': [
            'off', 
            {
              allowExpressions: true, 
              allowTypedFunctionExpressions: true,
            }
        ],

        'no-angle-bracket-type-assertion': 'none'
    }
}
