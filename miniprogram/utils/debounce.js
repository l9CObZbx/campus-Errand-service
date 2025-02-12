// 通用防抖函数
export function debounce(func, delay) {
    let timer = null; // 定义一个计时器
    return function (...args) {
        // 清除前一次的计时器
        if (timer) clearTimeout(timer);

        // 启动新的计时器
        timer = setTimeout(() => {
            func.apply(this, args); // 确保 `this` 和参数正确传递
        }, delay);
    };
}
