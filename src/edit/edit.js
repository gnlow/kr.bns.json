const data = JSON.parse(await Deno.readTextFile("../load/data.json"))

let edited

edited = data.map(([lName, stations]) => {
    return [
        lName,
        [
            ...stations.filter(x => x[5] == 65).reverse(),
            ...stations.filter(x => x[5] == 0),
            ...stations.filter(x => x[5] == 64),
        ]
    ]
})

await Deno.writeTextFile("edited.json", JSON.stringify(edited))