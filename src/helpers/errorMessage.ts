function errorMessage(error: Error | any): string {
    let message: string
    if (error instanceof Error) {
        message = error.message
        console.log("///////////////////////////////////////////////")
        console.log(message)
        console.log(error.stack)
    }
    else message = String(error)
    return message;
}

export default errorMessage;