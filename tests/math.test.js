const { calculateTip, celsiusToFahrenheit, fahrenheitToCelsius, add } = require('../src/math')

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 0.3)

    // if(total !== 13) {
    //     throw new Error('Total tip should be 13. Got ' + total)
    // }

    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert celsius to Farenheit', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Should convert farenheight to celcius', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
    
// })

test('This will add 2 numbers', (done) => {

    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
    })
    done()
})

test('Should add 2 numbers async/await', async () => {
    const sum = await add(20, 32)
    expect(sum).toBe(52)
})

