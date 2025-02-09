import * as alt from 'alt-client';

let isInVehicle = false;
let isEnteringVehicle = false;
let isJumping = false;
let inPauseMenu = false;
let player = alt.Player.local;
let current = {};

function getPedVehicleSeat(vehicle) {
    for (let i = -1; i <= 16; i++) {
        if (vehicle.getPedInSeat(i) === player.scriptID) return i;
    }
    return -1;
}

function getData(vehicle) {
    if (!vehicle || !vehicle.valid) return;
    return {
        displayName: vehicle.model,
        netId: vehicle.id,
    };
}

alt.everyTick(() => {
    if (player.scriptID !== alt.Player.local.scriptID) {
        player = alt.Player.local;
        alt.emit('esx:playerPedChanged', player.scriptID);
    }

    if (player.isJumping && !isJumping) {
        isJumping = true;
        alt.emit('esx:playerJumping');
    } else if (!player.isJumping && isJumping) {
        isJumping = false;
    }

    if (alt.isMenuOpen() && !inPauseMenu) {
        inPauseMenu = true;
        alt.emit('esx:pauseMenuActive', inPauseMenu);
    } else if (!alt.isMenuOpen() && inPauseMenu) {
        inPauseMenu = false;
        alt.emit('esx:pauseMenuActive', inPauseMenu);
    }

    if (!isInVehicle && !player.isDead) {
        let vehicle = player.vehicle;
        if (vehicle && !isEnteringVehicle) {
            let seat = getPedVehicleSeat(vehicle);
            let data = getData(vehicle);
            isEnteringVehicle = true;
            alt.emit('esx:enteringVehicle', vehicle, seat, data.netId);
        } else if (!vehicle && isEnteringVehicle) {
            alt.emit('esx:enteringVehicleAborted');
            isEnteringVehicle = false;
        } else if (vehicle) {
            isEnteringVehicle = false;
            isInVehicle = true;
            current = {
                vehicle,
                seat: getPedVehicleSeat(vehicle),
                displayName: vehicle.model,
                netId: vehicle.id,
            };
            alt.emit('esx:enteredVehicle', current.vehicle, current.seat, current.displayName, current.netId);
        }
    } else if (isInVehicle) {
        if (!player.vehicle || player.isDead) {
            alt.emit('esx:exitedVehicle', current.vehicle, current.seat, current.displayName, current.netId);
            isInVehicle = false;
            current = {};
        }
    }
    alt.setTimeout(() => {}, 200);
});

if (alt.debug) {
    alt.on('esx:playerPedChanged', (scriptID) => console.log('esx:playerPedChanged', scriptID));
    alt.on('esx:playerJumping', () => console.log('esx:playerJumping'));
    alt.on('esx:enteringVehicle', (vehicle, seat, netId) => console.log('esx:enteringVehicle', vehicle, seat, netId));
    alt.on('esx:enteringVehicleAborted', () => console.log('esx:enteringVehicleAborted'));
    alt.on('esx:enteredVehicle', (vehicle, seat, displayName, netId) => console.log('esx:enteredVehicle', vehicle, seat, displayName, netId));
    alt.on('esx:exitedVehicle', (vehicle, seat, displayName, netId) => console.log('esx:exitedVehicle', vehicle, seat, displayName, netId));
}
