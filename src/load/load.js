const lines = require("./lines.json")

const pptr = require("puppeteer")
const { writeFile } = require("fs").promises;

(async () => {
    const browser = await pptr.launch()
    const page = await browser.newPage()

    let allStations = []

    for (const [line, name, id, start, end] of lines) {
        console.log(`Loading...: ${name}`)

        await page.goto(`https://rail.blue/railroad/logis/line.aspx?id=${id}`, { waitUntil: "networkidle2" })
        let stations = await page.evaluate(
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
        if (start && end) {
            stations = stations.splice(
                stations.findIndex(x => x[1] == start),
                stations.findIndex(x => x[1] == end) + 1,
            )
        }
        allStations.push([name, stations])
    }

    await browser.close()

    console.log("Writing file...: data.json")
    await writeFile("./data.json", JSON.stringify(allStations))
})();