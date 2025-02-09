import * as alt from 'alt-client';
import * as native from 'natives';

let npwd = null;

function checkPhone() {
    if (!npwd) return;
    
    const phoneItem = alt.emitRpc('esx:searchInventory', 'phone');
    if (phoneItem && phoneItem.count > 0) {
        npwd.setPhoneDisabled(false);
    } else {
        npwd.setPhoneDisabled(true);
    }
}

alt.on('esx:playerLoaded', checkPhone);

alt.on('resourceStart', (resource) => {
    if (resource !== 'npwd') return;
    
    npwd = alt.emitRpc('getNpwdResource');
    if (alt.Player.local.hasMeta('ESX.PlayerLoaded')) {
        checkPhone();
    }
});

alt.on('resourceStop', (resource) => {
    if (resource === 'npwd') {
        npwd = null;
    }
});

alt.on('esx:onPlayerLogout', () => {
    if (!npwd) return;
    
    npwd.setPhoneVisible(false);
    npwd.setPhoneDisabled(true);
});

alt.on('esx:removeInventoryItem', (item, count) => {
    if (!npwd) return;
    
    if (item === 'phone' && count === 0) {
        npwd.setPhoneDisabled(true);
    }
});

alt.on('esx:addInventoryItem', (item) => {
    if (!npwd || item !== 'phone') return;
    
    npwd.setPhoneDisabled(false);
});
