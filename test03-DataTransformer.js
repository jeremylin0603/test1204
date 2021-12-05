const userIds = ['U01', 'U02', 'U03']
const userData = {
    'U01': 'Tom',
    'U02': 'Sam',
    'U03': 'John'
}
const orderIds = ['T01', 'T02', 'T03', 'T04']

// user ref orderIds
const userOrders = [
    { userId: 'U01', orderIds: ['T01', 'T02'] },
    { userId: 'U02', orderIds: [] },
    { userId: 'U03', orderIds: ['T03'] },
]

// order info
const orderData = {
    'T01': { name: 'A', price: 499 },
    'T02': { name: 'B', price: 599 },
    'T03': { name: 'C', price: 699 },
    'T04': { name: 'D', price: 799 },
}

const getUserInfo = (userId) => {
    return {
        id: userId,
        name: userData[userId]
    }
}

const getCurrentOrders = (orderIds) => {
    return orderIds.reduce((acc, orderId) => {
        return [
            ...acc,
            { id: orderId, ...orderData[orderId] }
        ]
    }, [])
}

const getResult = (userIds) => {
    return userIds.reduce((acc, currentUserId) => {
        const { orderIds } = userOrders.find(({ userId }) => userId === currentUserId)
    
        return [
            ...acc,
            {
                user: getUserInfo(currentUserId),
                orders: getCurrentOrders(orderIds)
            }
        ]
    }, [])
}

const result = getResult(userIds)
// console.log(result);

/**
 * ps. 若能保證 (userIds & userData)、(orderIds & orderData) 的一致性, 完全可以省略 userIds & orderIds 來實作
 */