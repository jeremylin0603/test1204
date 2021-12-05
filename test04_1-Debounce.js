export const debounce = (func, delay) => {
    let timeTicker = null

    return function () {
        // 在外部執行環境保存變數和 this 指向
        const args = arguments
        const _this = this

        clearTimeout(timeTicker)

        timeTicker = setTimeout(() => {
            func.apply(_this, args)
        }, delay);
    }
}

// const debounceFunc = debounce(console.log, 1000)
// debounceFunc('sayHi')