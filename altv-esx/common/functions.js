const Charset = [];

for (let i = 48; i <= 57; i++) Charset.push(String.fromCharCode(i));
for (let i = 65; i <= 90; i++) Charset.push(String.fromCharCode(i));
for (let i = 97; i <= 122; i++) Charset.push(String.fromCharCode(i));

const weaponsByName = {};
const weaponsByHash = {};

alt.on('resourceStart', () => {
    for (let index in Config.Weapons) {
        const weapon = Config.Weapons[index];
        weaponsByName[weapon.name.toUpperCase()] = index;
        weaponsByHash[joaat(weapon.name)] = weapon;
    }
});

function getRandomString(length) {
    if (length <= 0) return '';
    return getRandomString(length - 1) + Charset[Math.floor(Math.random() * Charset.length)];
}

function getConfig() {
    return Config;
}

function getWeapon(weaponName) {
    weaponName = weaponName.toUpperCase();
    if (!weaponsByName[weaponName]) throw new Error("Invalid weapon name!");
    const index = weaponsByName[weaponName];
    return [index, Config.Weapons[index]];
}

function getWeaponFromHash(weaponHash) {
    weaponHash = typeof weaponHash === 'string' ? joaat(weaponHash) : weaponHash;
    return weaponsByHash[weaponHash];
}

function getWeaponList(byHash = false) {
    return byHash ? weaponsByHash : Config.Weapons;
}

function getWeaponLabel(weaponName) {
    weaponName = weaponName.toUpperCase();
    if (!weaponsByName[weaponName]) throw new Error("Invalid weapon name!");
    const index = weaponsByName[weaponName];
    return Config.Weapons[index].label || "";
}

function getWeaponComponent(weaponName, weaponComponent) {
    weaponName = weaponName.toUpperCase();
    if (!weaponsByName[weaponName]) throw new Error("Invalid weapon name!");
    
    const weapon = Config.Weapons[weaponsByName[weaponName]];
    return weapon.components.find(component => component.name === weaponComponent) || null;
}

function dumpTable(table, nb = 0) {
    if (typeof table !== 'object' || table === null) return String(table);
    let s = '{\n';
    const indent = '    '.repeat(nb + 1);
    for (const [k, v] of Object.entries(table)) {
        s += `${indent}["${k}"] = ${dumpTable(v, nb + 1)},\n`;
    }
    return s + '    '.repeat(nb) + '}';
}

function round(value, numDecimalPlaces) {
    return parseFloat(value.toFixed(numDecimalPlaces));
}

export { getRandomString, getConfig, getWeapon, getWeaponFromHash, getWeaponList, getWeaponLabel, getWeaponComponent, dumpTable, round };
