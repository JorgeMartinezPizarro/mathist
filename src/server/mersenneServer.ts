// Base URL of the lucas-lehmer-server backends used by /api/mersenne, one per
// language. The host defaults to 127.0.0.1, where npm run dev finds them. Inside
// docker compose it is the service name, e.g. llt-c, with the container port.
const ENV_VARS = {
    c: { host: "MERSENNE_HOST_C", port: "MERSENNE_PORT_C" },
    go: { host: "MERSENNE_HOST_GO", port: "MERSENNE_PORT_GO" },
} as const

export type MersenneLanguage = keyof typeof ENV_VARS

export const MERSENNE_LANGUAGES = Object.keys(ENV_VARS) as MersenneLanguage[]

export const isMersenneLanguage = (value: string): value is MersenneLanguage => Object.hasOwn(ENV_VARS, value)

// 127.0.0.1 rather than localhost, which may resolve to ::1 first
const DEFAULT_HOST = "127.0.0.1"

const mersenneServer = (language: MersenneLanguage): string => {
    const vars = ENV_VARS[language]

    const host = process.env[vars.host]?.trim() || DEFAULT_HOST
    if (!/^[\w.-]+$/.test(host)) {
        throw new Error(vars.host + " = " + host + " is not a valid host")
    }

    const value = process.env[vars.port]?.trim()
    if (!value) {
        throw new Error(vars.port + " is not set")
    }
    const port = Number(value)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(vars.port + " = " + value + " is not a valid port")
    }

    return "http://" + host + ":" + port
}

export default mersenneServer
