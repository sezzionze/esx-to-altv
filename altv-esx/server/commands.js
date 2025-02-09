import * as alt from 'alt-server';
import * as chat from 'chat';

chat.registerCmd('setcoords', (player, args) => {
    if (!player || !args.x || !args.y || !args.z) return;
    player.pos = new alt.Vector3(parseFloat(args.x), parseFloat(args.y), parseFloat(args.z));
});

chat.registerCmd('setjob', (player, args) => {
    if (!args.playerId || !args.job || !args.grade) return;
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        target.setMeta('job', args.job);
        target.setMeta('jobGrade', args.grade);
        alt.log(`${player.name} set ${target.name}'s job to ${args.job} with grade ${args.grade}`);
    }
});

chat.registerCmd('car', (player, args) => {
    if (!args.car) args.car = 'adder';
    let vehicle = new alt.Vehicle(args.car, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    vehicle.numberPlateText = "ADMINCAR";
    player.setIntoVehicle(vehicle, 1);
});

chat.registerCmd('cardel', (player, args) => {
    let radius = args.radius ? parseFloat(args.radius) : 5.0;
    alt.Vehicle.all.forEach(vehicle => {
        if (vehicle.pos.distanceTo(player.pos) <= radius) {
            vehicle.destroy();
        }
    });
});

chat.registerCmd('giveaccountmoney', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        let balance = target.getMeta(args.account) || 0;
        target.setMeta(args.account, balance + parseInt(args.amount));
    }
});

chat.registerCmd('setgroup', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        target.setMeta('group', args.group);
    }
});

chat.registerCmd('coords', (player) => {
    alt.log(`Coords: ${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
});

chat.registerCmd('tpm', (player) => {
    alt.emitClient(player, 'esx:tpm');
});

chat.registerCmd('goto', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        player.pos = target.pos;
    }
});

chat.registerCmd('bring', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        target.pos = player.pos;
    }
});

chat.registerCmd('kill', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        alt.emitClient(target, 'esx:killPlayer');
    }
});

chat.registerCmd('freeze', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        target.setMeta('frozen', true);
    }
});

chat.registerCmd('unfreeze', (player, args) => {
    let target = alt.Player.all.find(p => p.id === parseInt(args.playerId));
    if (target) {
        target.setMeta('frozen', false);
    }
});

chat.registerCmd('noclip', (player) => {
    alt.emitClient(player, 'esx:noclip');
});

chat.registerCmd('players', (player) => {
    alt.log(`Online Players: ${alt.Player.all.length}`);
    alt.Player.all.forEach(p => {
        alt.log(`ID: ${p.id} | Name: ${p.name}`);
    });
});
