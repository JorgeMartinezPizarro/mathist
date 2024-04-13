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
            &nbsp;
            {number.toString().length > 20 && <Button title="Click here to copy the number"><ContentCopyIcon onClick={() => {navigator.clipboard.writeText(number.toString())}} /></Button>}
        </span>
        
    
    </>);
}

export default  NumberToString;