import locale from "./locale";

interface NumberToLocaleProps {
    number: bigint|number;
    singular: string;
}

const NumberToLocale = (props: NumberToLocaleProps) => {

    const numberToLocale = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten"
    ];

    const {number, singular} = props;
    
    return (<span style={{display: "inline-block"}} title={number.toString().length > 20 ? "It is a " + number.toString().length + " digits number" +  locale(BigInt(number)) : undefined}>
        {
            (BigInt(number) < BigInt(numberToLocale.length) ? numberToLocale[parseInt(number.toString())] : number.toString()) +
            " " + 
            (BigInt(number) === BigInt(1) ? singular : (singular + "s"))
        }
    </span>);
}

export default NumberToLocale;