const throttle = (func, timeout) => {
    let timeTicker = null
    let isInit = false

    return function () {
        // 初次點擊應立即執行
        if (!isInit) {
            func(...arguments)
            isInit = true
            return
        }

        // 若 timeTicker 正在倒數, 則阻擋呼叫
        if (timeTicker) return

        const _this = this
        const args = arguments

        timeTicker = setTimeout(function () {
            func.apply(_this, args)
            clearTimeout(timeTicker)
            timeTicker = null
        }, timeout);
    }
}

// const throttleFunc = throttle(console.log, 1000)
// throttleFunc('say hi')