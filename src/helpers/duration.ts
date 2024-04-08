export default function duration(microseconds: number) {
    
    const millisecond = 1000            // a millisecond in microseconds
    const second = 1000 * millisecond   // a second in microseconds 
    const minute = 60 * second          // a minute in microseconds
    const hour = 60 * minute            // an hour in microseconds
    
    if (microseconds > hour) {
        // hours
        return Math.floor(microseconds  / hour) + " h " + Math.floor((microseconds - Math.floor(microseconds  / hour) * hour) / minute) + " m";
    } else if (microseconds > minute) {
        // minutes
        return Math.floor(microseconds  / minute) + " m " + Math.floor((microseconds - Math.floor(microseconds  / minute) * minute) / second) + " s";
    } else if (microseconds > second) {
        // seconds
        return Math.floor(microseconds / second) + " s"
    } else if (microseconds > millisecond) {
        // milliseconds
        return Math.floor(microseconds / millisecond) + " ms"
    }
    // microseconds
    return microseconds + " μs"
  
}