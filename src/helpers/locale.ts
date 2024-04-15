function locale(number: bigint) {
    
    const units = [
        {value: BigInt(1000)**BigInt(6), unit: "-"}, 
        {value: BigInt(1000)**BigInt(5), unit: "q"}, 
        {value: BigInt(1000)**BigInt(4), unit: "t"}, 
        {value: BigInt(1000)**BigInt(3), unit: "b"}, 
        {value: BigInt(1000)**BigInt(2), unit: "m"}, 
        {value: BigInt(1000),            unit: "k"}, 
    ];

    if (number >= units[0].value) {
        return number.toString()[0] + "E" + (number.toString().length - 1)
    }
    
    for (var i = 1; i<units.length; i++)
        if (number >= units[i].value)
            return number  / units[i].value + "" + units[i].unit
    
    return number + ""
}

export default locale;