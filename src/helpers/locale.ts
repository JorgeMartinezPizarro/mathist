function locale(number: bigint) {
    
    const thousand = BigInt(1000)         
    const million = thousand * thousand
    const billion = thousand * million
    const trillion = thousand * billion
    const quatrillion = thousand * trillion
    const quintillion = thousand * quatrillion

    if (number > quintillion) {
        return number.toString()[0] + "E" + (number.toString().length - 1)
    }
    else if (number > quatrillion) {
        return number  / quatrillion + "q"
    } else if (number > trillion) {
        return number  / trillion + "t"
    } else if (number > billion) {
        return number  / billion + "b"
    } else if (number > million) {
        return number / million + "m"
    } else if (number > thousand) {
        return number / thousand + "k"
    }
    return number + ""
    
}

export default locale;