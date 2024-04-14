function errorMessage(error: Error | any): string {
    let message: string
    if (error instanceof Error) message = error.message
    else message = String(error)
    return message;
}

export default errorMessage;