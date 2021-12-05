// NodeElement: linked list 的節點
// 這裡為了降低 pop method 的時間複雜度, 寫成雙鏈結串列, 具備兩個指針: prev(前一個) & next(後一個)
// 避免 Node 有成為 JS 關鍵字的可能, 將命名補為 NodeElement
class NodeElement {
    constructor (data) {
        this.data = data
        this.prev = null
        this.next = null
    }
}

const Stack = class {
    constructor () {
        this.head = null
        this.tail = null
        this.length = 0
    }

    push (data) {
        const newNode = new NodeElement(data)

        // 若 push 進來的是第一個節點, 則不需處理前後 node 之間的指針
        if (this.head === null) {
            this.head = newNode
        } else {
            this.tail.next = newNode
            newNode.prev = this.tail
        }

        this.tail = newNode
        this.length++

        return newNode.data
    }

    pop () {
        if (this.length === 0) return null

        const popData = this.tail.data

        // 若當前 node 剩下一個, pop 後需清空所有指向
        if (this.length === 1) {
            this.head = null
            this.tail = null
        } else {
            this.tail = this.tail.prev
            this.tail.next = null
        }

        this.length--
        return popData
    }

    size () {
        return this.length
    }
}

// const myStack = new Stack()
// console.log(myStack.push(1))
// console.log(myStack.push(2))
// console.log(myStack.push(3))
// console.log(myStack.pop())
// console.log(myStack.size())