import { CircularProgress } from "@mui/material";

function Progress() {
    return <span className="progress" >
        <CircularProgress size={26} className="circular"/>
    </span>
}

export default Progress;