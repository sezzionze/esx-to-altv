import * as alt from 'alt-server';
import * as chat from 'alt:chat';

alt.on('playerConnect', (player) => {
    player.model = 'mp_m_freemode_01';
    player.spawn(0, 0, 72, 0);
    player.health = 200;
    player.armour = 100;

    chat.broadcast(`${player.name} has joined the server.`);

    player.setMeta('hud', true);
    player.setMeta('pvp', true);

    player.on('respawn', () => {
        player.clearBloodDamage();
        player.health = 200;
        player.armour = 100;
        player.clearWeapons();
    });

    player.emit('setAmbientNoise', false);
});

alt.on('playerDisconnect', (player) => {
    chat.broadcast(`${player.name} has left the server.`);
});

alt.onClient('esx:requestModel', (player, model) => {
    player.model = model;
});

alt.onClient('esx:playerLoaded', (player, xPlayer, isNew, skin) => {
    player.setMeta('playerData', xPlayer);

    if (!isNew) {
        player.spawn(xPlayer.coords.x, xPlayer.coords.y, xPlayer.coords.z, xPlayer.coords.heading);
    } else {
        player.spawn(0, 0, 72, 0);
    }

    if (isNew) {
        player.emit('skinchanger:loadDefaultModel', skin.sex === 0);
    } else if (skin) {
        player.emit('skinchanger:loadSkin', skin);
    }

    player.emit('esx:loadingScreenOff');
});

alt.onClient('esx:setJob', (player, job) => {
    player.setMeta('job', job);
});

alt.onClient('esx:addInventoryItem', (player, item, count) => {
    let inventory = player.getMeta('inventory') || {};
    inventory[item] = (inventory[item] || 0) + count;
    player.setMeta('inventory', inventory);
});

alt.onClient('esx:removeInventoryItem', (player, item, count) => {
    let inventory = player.getMeta('inventory') || {};
    if (inventory[item]) {
        inventory[item] = Math.max(inventory[item] - count, 0);
    }
    player.setMeta('inventory', inventory);
});

alt.onClient('esx:addWeapon', (player, weapon, ammo) => {
    player.giveWeapon(weapon, ammo);
});

alt.onClient('esx:removeWeapon', (player, weapon) => {
    player.removeWeapon(weapon);
});

alt.onClient('esx:killPlayer', (player) => {
    player.health = 0;
});
