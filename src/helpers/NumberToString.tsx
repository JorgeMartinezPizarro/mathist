import { Button } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import locale from "./locale";

interface NumberToStringProps {
    number: number|bigint;
}

function NumberToString(props: NumberToStringProps) {

    const {number} = props;
    
    return (<>
        <span title={"It is a " + number.toString().length + " digits number. Also " +  locale(BigInt(number))}>
            {number.toString()}
        </span>
        
    
    </>);
}

export default  NumberToString;