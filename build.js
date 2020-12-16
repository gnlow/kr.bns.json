import colors from "./colors.js"

const lines = JSON.parse(await Deno.readTextFile("./src/load/lines.json"))
const source = JSON.parse(await Deno.readTextFile("./src/edit/edited.json"))
const basic = JSON.parse(await Deno.readTextFile("./src/default.json"))

let acc = 0
source.forEach(([lName, stations]) => {
    stations.forEach((station) => {
        station[6] = acc++
    })
})

basic.lines.push(...source.map(([lName, stations], i) => (
    {
        name: `${lines[i][0]}_${lines[i][1]}`,
        html: lines[i][0],
        css: (lines[i][0].length == 1)
            ? "subway-line"
            : "subway-line-long",
        color_bg: colors[lines[i][0]][0],
        color_text: colors[lines[i][0]][1],
        stations: stations.map(x => x[6]),
        draw_map: stations.map(x => x[6]),
        id: 97 + i,
    }
)))

basic.stations.push(
    ...source
        .map((x, i) => x[1].map(y => (y[7] = 97 + i, y)))
        .flat()
        .map(([n, name, line, lat, lng, st, id, lId]) => (
            {
                lat,
                lng,
                name,
                info: "",
                riders: 0,
                lines: [lId],
                id,
                active: true,
            }
        ))
)
Deno.writeTextFile("save.json", JSON.stringify(basic))