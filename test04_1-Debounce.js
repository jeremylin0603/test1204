export const debounce = (func, delay) => {
    let timeTicker = null

    return function () {
        if (timeTicker) clearTimeout(timeTicker)

        timeTicker = setTimeout(() => {
            func.apply(this, arguments)
        }, delay);
    }
}

// const debounceFunc = debounce(console.log, 1000)
// debounceFunc('sayHi')
