const data = JSON.parse(await Deno.readTextFile("../load/data.json"))

let edited

edited = data.map(([lName, stations]) => {
    stations = [
        ...stations.filter(x => x[5] == 65).reverse(),
        ...stations.filter(x => x[5] == 0),
        ...stations.filter(x => x[5] == 64),
    ]
    if (
        [
            "우이",
        ].includes(lName)
    ) {
        stations = stations.sort((a, b) => a[0] - b[0])
    }
    return [
        lName,
        stations,
    ]
})

await Deno.writeTextFile("edited.json", JSON.stringify(edited))