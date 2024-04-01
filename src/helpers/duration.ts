export default (microseconds: number) => {
    if (microseconds > 60 * 10**6) {
        return Math.floor(microseconds  / 60000000) + " m " + Math.floor((microseconds - Math.floor(microseconds  / 60000000) * 60000000) / 1000000) + " s";
    } else if (microseconds > 10**6) {
        return Math.floor(microseconds / 10**6) + " s"
    } else if (microseconds > 10**3) {
        return Math.floor(microseconds / 1000) + " ms"
    }
    return microseconds + " μs"
  
}