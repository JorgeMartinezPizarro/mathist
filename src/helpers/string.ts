export default (value: BigInt) => {

    if (value.toString().length < 6) 
        return value.toString()
    else if (value.toString().length < 21) 
        return value.toString() + "(" + value.toString().length+ ")"
    else
        return value.toString().slice(0, 5) + "..." +  value.toString().slice(-5) + "(" + value.toString().length + ")"
}
