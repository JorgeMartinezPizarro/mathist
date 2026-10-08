// Base URL of the external compute servers (lucas-lehmer-server, fortran sieve).
// Set MATHER_COMPUTE_HOST to the host running them, e.g. localhost in dev.
const computeServer = (port: number): string => {
    const host = process.env.MATHER_COMPUTE_HOST?.trim()
    if (!host) {
        throw new Error("MATHER_COMPUTE_HOST is not set")
    }
    return "http://" + host + ":" + port
}

export default computeServer;
