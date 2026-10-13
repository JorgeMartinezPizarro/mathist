// Base URL of the lucas-lehmer-server backends used by /api/mersenne. They
// listen on localhost only, each language on the port set in its env var.
const PORT_VARS = { c: "MERSENNE_PORT_C", go: "MERSENNE_PORT_GO" } as const

export type MersenneLanguage = keyof typeof PORT_VARS

export const MERSENNE_LANGUAGES = Object.keys(PORT_VARS) as MersenneLanguage[]

export const isMersenneLanguage = (value: string): value is MersenneLanguage => Object.hasOwn(PORT_VARS, value)

// 127.0.0.1 rather than localhost, which may resolve to ::1 first
const mersenneServer = (language: MersenneLanguage): string => {
    const name = PORT_VARS[language]
    const value = process.env[name]?.trim()
    if (!value) {
        throw new Error(name + " is not set")
    }
    const port = Number(value)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(name + " = " + value + " is not a valid port")
    }
    return "http://127.0.0.1:" + port
}

export default mersenneServer
