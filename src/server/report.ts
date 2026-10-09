import fs from "node:fs"
import os from "node:os"

// Same accent as the website (Cuaderno palette)
const STYLE = "body {font-family: sans-serif;} hr {height: 1px; background-color: #b4532a; border: none; margin: 16px;} b, th, h3 {color: #b4532a;}"

// Writes an HTML report of the server under public/files and returns its public path.
// Each line is a piece of HTML, usually a centered paragraph or a table.
export default function writeReport(filename: string, title: string, lines: string[]): string {
    const cpu = os.cpus()[0]
    const html = [
        "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>" + STYLE + "</style></head><body>",
        "<h3 style='text-align: center;'>" + title + " of math.ideniox.com</h3>",
        "<p style='text-align: center;'><b>" + cpu.model + " " + (cpu.speed / 1000) + "GHz, " + os.cpus().length + " cores, " + process.arch + "</b></p>",
        "<hr/>",
        ...lines,
        "</body></html>",
    ]
    fs.writeFileSync("./public/files/" + filename, html.join(""), "utf8")
    return "/files/" + filename
}
