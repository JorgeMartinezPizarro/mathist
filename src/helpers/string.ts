export default function string(value: bigint) {

    if (value.toString().replaceAll("-", "").length < 6)
        return value.toString()
    else if (value.toString().replaceAll("-", "").length < 32) 
        return value.toString() + "(" + value.toString().replaceAll("-", "").length+ ")"
    else
        return value.toString().slice(0, 12) + "..." +  value.toString().slice(-12) + "(" + value.toString().replaceAll("-", "").length + ")"
}