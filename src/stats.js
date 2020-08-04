const fs = require('fs');
const process = require('process');

const fileData = fs.readFileSync(process.stdin.fd, 'utf-8');
const data = JSON.parse(fileData)

/*
 * Item E.g.:
 *
 *  {
 *    "time": 1593720776018,
 *    "type": "kill",
 *    "killer": "orkus",
 *    "weapon": "GAUSS GUN",
 *    "victim": "BadScience"
 *  },
 *
 */
const kills = {};
const players = {}; // this is a poor man's set with all null values
for (const item of data) {
    if (!players[item.killer]) { players[item.killer] = null }
    if (!players[item.victim]) { players[item.victim] = null }

    const key = JSON.stringify([item.killer, item.victim]);
    const value = kills[key];
    kills[key] = value == undefined ? 1 : value + 1;
}

const table = {};
const deathTotals = {};
for (const killer of Object.keys(players)) {
    let killerTotal = 0
    for (const victim of Object.keys(players)) {
        if (!table[killer]) { table[killer] = {} }
        const tmp = {};
        const value = kills[JSON.stringify([killer, victim])];
        const killCount = value == undefined ? 0 : value;
        table[killer][victim] = killCount
        Object.assign(table[killer], tmp);

        killerTotal += killCount
        const deathsSoFar = deathTotals[victim];
        deathTotals[victim] = deathsSoFar == undefined ? killCount : deathsSoFar + killCount;
    }
    table[killer]['total_kills'] = killerTotal;
}
deathTotals['total_kills'] = Object.values(deathTotals).reduce((a, b) => a + b, 0)
table['total_deaths'] = deathTotals;

console.table(table);
