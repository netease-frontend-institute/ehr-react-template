module.exports = {
    extends: [
        'eslint-config-airbnb',
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
        // 语法风格
        'indent': ['warn', 4, { "SwitchCase": 1 }],

        'react/jsx-indent': [4, 'tab'],

        'react/jsx-indent-props': [4, 'tab'],

        'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.tsx'] }], // 允许写jsx内容的文件扩展名列表

        'arrow-parens': ['error', 'as-needed'], // 箭头函数参数只有一个时，可以省略参数的括号，否则error提示

        'no-unused-vars': 'off', // 由ts处理

        'no-debugger': 'warn', // 允许使用debugger

        'no-console': 'off', // 允许使用console.log

        'no-cond-assign': 'off', // 允许在条件表达式中赋值

        'prettier/prettier': 'warn', // 对于prettier报错进行warn提醒

        // 导入部分
        'import/no-unresolved': 'off', // 由ts处理

        'import/prefer-default-export': 'off', // 若只有一条export，也无需export default

        "import/no-extraneous-dependencies": 'off',

        "import/no-extraneous-dependencies": 'off',

        "import/extensions": 'off',

        // react部分
        'react/jsx-one-expression-per-line': 'off', // 表达式无需另起一行

        'react/destructuring-assignment': 'off', // 不强制指定值被使用前的解构赋值

        'react/prefer-stateless-function': 'off', // 不强制只能写无状态组件

        "react/prop-types": 'off', // 不强制使用prop-types

        "react/jsx-wrap-multilines": 'off', // 不强制多行包裹

        'react/no-danger': 'off',

        "react-hooks/rules-of-hooks": "error",

        "react-hooks/exhaustive-deps": "warn",

        // a11y部分
        
        "jsx-a11y/click-events-have-key-events": 'off', // 必须添加键盘事件
        
        "jsx-a11y/anchor-is-valid": 'off', // a标签无需设定href

        "jsx-a11y/no-static-element-interactions": 'off', // a标签不需要role

        "jsx-a11y/interactive-supports-focus": 'off', // 无需声明tabIndex

        // typescript 部分
        '@typescript-eslint/no-explicit-any': 'off', // 允许使用any

        "@typescript-eslint/interface-name-prefix": "off", // 允许interface定义以I开头

        '@typescript-eslint/no-unused-vars': ['error', {
            vars: 'all',
            args: 'none',
            ignoreRestSiblings: true
        }], // 不允许使用var声明未使用的变量，但对于：函数中的参数、解构赋值后的变量可以声明未使用
        
        '@typescript-eslint/explicit-function-return-type': [
            'off', 
            {
              allowExpressions: true, 
              allowTypedFunctionExpressions: true,
            }
        ], // 函数不必声明返回类型

        '@typescript-eslint/ban-ts-ignore': 'off', // 可以通过@ts-ignore注释指定行报错

        'no-angle-bracket-type-assertion': 'none', // 类型断言使用`as Type`而不是`<Type>`
    }
}
