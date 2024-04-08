export default function string(value: BigInt) {

    if (value.toString().length < 4) 
        return value.toString()
    else if (value.toString().length < 25) 
        return value.toString() + "(" + value.toString().length+ ")"
    else
        return value.toString().slice(0, 5) + "..." +  value.toString().slice(-5) + "(" + value.toString().length + ")"
}
