let ESX = {
    Players: {},
    Jobs: {},
    Items: {},
    TotalItems: 0,
    TotalJobs: 0,
    TotalJobGrade: 0
};

let Core = {
    UsableItemsCallbacks: {},
    ServerCallbacks: {},
    ClientCallbacks: {},
    CurrentRequestId: 0,
    RegisteredCommands: {},
    Pickups: {},
    PickupId: 0,
    PlayerFunctionOverrides: {},
    playersByIdentifier: {}
};

function StartDBSync() {
    setInterval(() => {
        Core.SavePlayers();
    }, 10 * 60 * 1000);
}

alt.on('esx:getSharedObject', (cb) => {
    if (Config.EnableDebug) {
        const Invoke = alt.getInvokingResource();
        console.log(`[ERROR] Resource ${Invoke} Used the getSharedObject Event, this event no longer exists! Visit https://documentation.esx-framework.org/tutorials/sharedevent for how to fix!`);
    }
    cb(ESX);
});

alt.exports('getSharedObject', () => ESX);

MySQL.ready(async () => {
    const items = await MySQL.query('SELECT * FROM items');
    items.forEach(v => {
        ESX.Items[v.name] = {
            label: v.label,
            limit: v.limit,
            rare: v.rare,
            canRemove: v.can_remove
        };
        ESX.TotalItems++;
    });

    ESX.RefreshJobs();

    console.log(`[INFO] Jomjam ESX Legacy 1.9.2 has been Initialized`);
    console.log(`[INFO] Registered Jobs: ${ESX.TotalJobs}`);
    console.log(`[INFO] Registered Job Grades: ${ESX.TotalJobGrade}`);
    console.log(`[INFO] Registered Items: ${ESX.TotalItems}`);

    StartDBSync();

    if (Config.EnablePaycheck) {
        StartPayCheck();
    }
});

alt.on('esx:clientLog', (msg) => {
    if (Config.EnableDebug) {
        console.log(`[Jomjam] ${msg}`);
    }
});

alt.on('esx:triggerServerCallback', (name, requestId, Invoke, ...args) => {
    const source = alt.Player.getByID(source);
    
    ESX.TriggerServerCallback(name, requestId, source, Invoke, (...result) => {
        alt.emit('esx:serverCallback', source, requestId, Invoke, ...result);
    }, ...args);
});

alt.on('esx:ReturnVehicleType', (Type, Request) => {
    if (Core.ClientCallbacks[Request]) {
        Core.ClientCallbacks[Request](Type);
        delete Core.ClientCallbacks[Request];
    }
});
