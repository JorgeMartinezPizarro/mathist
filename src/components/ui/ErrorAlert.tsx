interface ErrorAlertProps {
    error: string;
}

const ErrorAlert = ({ error }: ErrorAlertProps) =>
    error ? <p className="alert" role="alert">{error}</p> : null

export default ErrorAlert;
