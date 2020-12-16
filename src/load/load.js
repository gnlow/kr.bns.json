const lines = require("./lines.js")

const pptr = require("puppeteer")
const { writeFile } = require("fs").promises;

(async () => {
    const browser = await pptr.launch()
    const page = await browser.newPage()

    let allStations = []

    for (const [name, id, start, end] of lines) {
        console.log(`Loading...: ${name}`)

        await page.goto(`https://rail.blue/railroad/logis/line.aspx?id=${id}`, { waitUntil: "networkidle2" })
        const stations = await page.evaluate(
            () => _map_station.filter(
                ([sId, sName, type, lat, long]) => {
                    return ![
                        "rc",
                        "junction",
                        "base",
                    ].includes(type)
                }
            )
        )
        allStations.push(...stations)
        allStations = allStations.splice(
            allStations.findIndex(x => x[1] == start),
            allStations.findIndex(x => x[1] == end) + 1,
        )
    }

    await browser.close()

    console.log("Writing file...: data.json")
    await writeFile("./data.json", JSON.stringify(allStations))
})();