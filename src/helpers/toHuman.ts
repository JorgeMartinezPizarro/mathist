export default function toHuman(bytes: number) {
    
    if (!+bytes) {
      return '0 Bytes'
    }
    
    const k = 1024
    const sizes = [' bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  
    const i = Math.floor(Math.log(bytes) / Math.log(k))
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))}${sizes[i]}`
  }