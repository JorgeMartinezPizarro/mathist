import { CircularProgress } from "@mui/material";

interface ProgressProps {
    loading: boolean;
}

function Progress(props: ProgressProps) {
    return props.loading ? 
        <span className="progress" >
            <CircularProgress size={26} className="circular"/>
        </span> : 
        <span className="progress" />
}

export default Progress;