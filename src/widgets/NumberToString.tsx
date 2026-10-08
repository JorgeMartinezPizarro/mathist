import locale from "@/helpers/locale";

interface NumberToStringProps {
    // The API sends big integers as strings
    number: number | bigint | string;
}

function NumberToString(props: NumberToStringProps) {

    const {number} = props;
    const digits = number.toString();

    return <span className="num" title={digits.length > 5 ? "It is a " + digits.length + " digits number, " + locale(BigInt(number)) : undefined}>
        {digits}
    </span>
}

export default NumberToString;
