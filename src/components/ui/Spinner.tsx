interface SpinnerProps {
    loading: boolean;
}

// Keeps its space while hidden, so the form does not jump when loading starts
const Spinner = ({ loading }: SpinnerProps) =>
    <span className={loading ? "spinner active" : "spinner"} role={loading ? "status" : undefined} aria-label={loading ? "Loading" : undefined} />

export default Spinner;
