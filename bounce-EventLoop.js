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

const throttleFunc = throttle(console.log, 1000)

const userClick = (timeout) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('userClick');
            throttleFunc('throttleFunc')
            resolve()
        }, timeout);
    })
}

/**
 * 模擬使用者在
 * 0.0 秒
 * 0.5 秒
 * 1.0 秒
 * 1.2 秒
 * 1.4 秒
 * 1.6 秒
 * 3.0 秒
 * 點擊
 */
const IFFE = async function () {
    console.log('in IFFE context top');
    userClick(0)
    userClick(500)
    userClick(1000)
    userClick(1200)
    userClick(1400)
    userClick(1600)
    userClick(3000)
    console.log('in IFFE context bottom');
}()
console.log('im here');
/**
 * 有三個空間: [JS 執行堆]、[瀏覽器的非同步佇列]、[callback queue (非同步返回值的存放區 )]
 * 而其中的 [JS 執行堆] 有後進先出的特性。
 * 且當執行到 global context 的最後一行, 且 [JS 執行堆] 為空時, 才會去看 [callback queue] 有沒有任務要執行
 * -------------------------------------------------
 * 當 js 解析器執行到 IFFE 時, 因為他是 IFFE function, 而被立即執行(invoke)
 * 此時 [JS 執行堆] 中 push 進去 IFFE function
 * 
 * >>> JS 執行堆 = [IFFE context]
 * -------------------------------------------------
 * 接著先遇到一個 console.log, 將其 push 進 [JS 執行堆] 中
 * 
 * >>> JS 執行堆 = [IFFE context, console.log(...)]
 * -------------------------------------------------
 * 並且執行完畢後 console.log pop 出 stack
 * 
 * >>> JS 執行堆 = [IFFE context]
 * -------------------------------------------------
 * 然後在裡面有許多模擬使用者點擊的事件
 * 但因為他們是非同步的 Promise, 因此被丟到瀏覽器的非同步佇列中執行
 * 
 * > JS 執行堆 = [IFFE context]
 * >>> 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * -------------------------------------------------
 * IFFE 中走到最後, 又遇到一個 console.log, 一樣推入執行堆中
 * 
 * >>> JS 執行堆 = [IFFE context, console.log(...)]
 * > 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * -------------------------------------------------
 * 接著 console.log 執行完畢 pop 出 stack
 * 
 * >>> JS 執行堆 = [IFFE context]
 * > 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * -------------------------------------------------
 * 此時 IFFE context 跑完了, 也 pop 出 stack
 * 
 * >>> JS 執行堆 = []
 * > 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * -------------------------------------------------
 * 這時候假設 userClick(0) 結束計時了, pop 出 [瀏覽器的非同步佇列] 後其結果被 push 進 [callback queue]
 * 
 * > JS 執行堆 = []
 * > 瀏覽器的非同步佇列 = [userClick(500)、userClick(1000)...]
 * >>> callback queue = [throttleFunc]
 * -------------------------------------------------
 * 但是還沒到最後一行, 繼續往下走又遇到一個 console.log
 * 
 * >>> JS 執行堆 = [console.log(...)]
 * > 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * > callback queue = [throttleFunc]
 * -------------------------------------------------
 * 然後執行完一樣 pop 出來
 * 
 * >>> JS 執行堆 = []
 * > 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * > callback queue = [throttleFunc]
 * -------------------------------------------------
 * 此時終於到了外部環境 global context 的終點, 且 [JS 執行堆] 也空了
 * 便開始處理 [callback queue], 將其 pop 出來後 push 進 [JS 執行堆] 裏面
 * 這邊 throttleFunc 內部也有 setTimeout, 要講起來會再多好幾行, 若有機會面試的話可以口頭跑一次
 * 
 * >>> JS 執行堆 = [throttleFunc]
 * > 瀏覽器的非同步佇列 = [userClick(0)、userClick(500)、userClick(1000)...]
 * >>> callback queue = []
 * -------------------------------------------------
 * 處理完後一樣 pop 出 [JS 執行堆]
 * 接著沒其他事了就等待剩餘的 userClick 觸發, 觸發後先進 [callback queue] 再進 [JS 執行堆中]
 */