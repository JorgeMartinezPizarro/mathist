import locale from "./locale";

interface NumberToStringProps {
    number: number|bigint;
}

function NumberToString(props: NumberToStringProps) {

    const {number} = props;
    
    return (<>
        <span title={number.toString().length > 5 ? "It is a " + number.toString().length + " digits number, " +  locale(BigInt(number)) : undefined}>
            {number.toString()}
        </span>
        
    
    </>);
}

export default  NumberToString;