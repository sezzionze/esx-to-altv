import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('gameEventTriggered', (event, data) => {
    if (event !== 'CEventNetworkEntityDamage') return;
    
    const victim = data[0];
    const victimDied = data[3];
    if (!native.isPedAPlayer(victim)) return;
    
    const player = alt.Player.local;
    const playerPed = native.playerPedId();
    
    if (victimDied && native.networkGetPlayerIndexFromPed(victim) === player.id && 
        (native.isPedDeadOrDying(victim, true) || native.isPedFatallyInjured(victim))) {
        
        const killerEntity = native.getPedSourceOfDeath(playerPed);
        const deathCause = native.getPedCauseOfDeath(playerPed);
        const killerClientId = native.networkGetPlayerIndexFromPed(killerEntity);
        
        if (killerEntity !== playerPed && killerClientId && native.networkIsPlayerActive(killerClientId)) {
            playerKilledByPlayer(native.getPlayerServerId(killerClientId), killerClientId, deathCause);
        } else {
            playerKilled(deathCause);
        }
    }
});

function playerKilledByPlayer(killerServerId, killerClientId, deathCause) {
    const victimCoords = native.getEntityCoords(alt.Player.local.scriptID, true);
    const killerCoords = native.getEntityCoords(native.getPlayerPed(killerClientId), true);
    const distance = native.vdist(victimCoords.x, victimCoords.y, victimCoords.z, killerCoords.x, killerCoords.y, killerCoords.z);
    
    const data = {
        victimCoords: {
            x: Math.round(victimCoords.x * 10) / 10,
            y: Math.round(victimCoords.y * 10) / 10,
            z: Math.round(victimCoords.z * 10) / 10,
        },
        killerCoords: {
            x: Math.round(killerCoords.x * 10) / 10,
            y: Math.round(killerCoords.y * 10) / 10,
            z: Math.round(killerCoords.z * 10) / 10,
        },
        killedByPlayer: true,
        deathCause: deathCause,
        distance: Math.round(distance * 10) / 10,
        killerServerId: killerServerId,
        killerClientId: killerClientId
    };
    
    alt.emit('esx:onPlayerDeath', data);
    alt.emitServer('esx:onPlayerDeath', data);
}

function playerKilled(deathCause) {
    const playerPed = alt.Player.local.scriptID;
    const victimCoords = native.getEntityCoords(playerPed, true);
    
    const data = {
        victimCoords: {
            x: Math.round(victimCoords.x * 10) / 10,
            y: Math.round(victimCoords.y * 10) / 10,
            z: Math.round(victimCoords.z * 10) / 10,
        },
        killedByPlayer: false,
        deathCause: deathCause
    };
    
    alt.emit('esx:onPlayerDeath', data);
    alt.emitServer('esx:onPlayerDeath', data);
}
