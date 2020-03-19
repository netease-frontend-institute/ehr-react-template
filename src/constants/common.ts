// 全局都会用到的常量
export const LIMIT = 100;

// 签到状态Id
export const SignStatusId = {
    SIGNED: 0, // 已签到
    NOT_SIGN: 1, // 未签到
    GIVE_UP: 2 // 放弃面试
};

// 签到状态
export const SignStatus = {
    [SignStatusId.SIGNED]: '已签到',
    [SignStatusId.NOT_SIGN]: '未签到',
    [SignStatusId.GIVE_UP]: '放弃面试'
};
