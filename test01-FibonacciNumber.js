const fibonacci = (position) => {
    return position < 2
        ? position
        : fibonacci(position - 1) + fibonacci(position - 2)
}

// console.log(fibonacci(0));
// console.log(fibonacci(1));
// console.log(fibonacci(6));