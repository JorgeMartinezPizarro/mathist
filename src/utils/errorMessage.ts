function errorMessage(error: Error | any): string {
    let message: string
    if (error instanceof Error) {
        message = error.message
        console.log("An Error ocurred.")
        console.log(message)
        console.log(error.stack?.split("\n").slice(0, 5).join("\n"))
    }
    else message = String(error)
    return message;
}

export default errorMessage;