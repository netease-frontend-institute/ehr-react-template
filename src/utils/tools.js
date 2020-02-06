// 获取url中的参数
export const getParams = (url = location.href) => {
    var reg = /(\w+)=([^&]+)/g,
        params = {},
        result = [];

    url = url.split('?')[1] || '';

    while ((result = reg.exec(url))) {
        params[result[1]] = result[2];
    }
    return params;
};

/**
 * 深拷贝
 */
export const deepClone = source => {
    if (!source || typeof source !== 'object') {
        return source;
    }
    var targetObj = source.constructor === Array ? [] : {};
    for (var keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            } else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
};

/**
 * 函数防抖 (只执行最后一次点击)
 */
export const debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    return function() {
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    };
};

// 是否是手机号码
export const isMobile = str => /^(1)\d{10}$/.test(str);

// 是否是身份证
export const isIdCard = str => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);

// 是否是邮箱
export const isEmail = (str = '') => str.includes('@');

// 去除前后空格
export const empty = (str = '') => str.replace(/^\s+|\s+$/g, '');

// 去除所有空格
export const emptyAll = (str = '') => str.replace(/\s/g, '');

// 是否包含英文
export const includeEn = str => str.search(/[a-zA-Z]+/) > -1;
