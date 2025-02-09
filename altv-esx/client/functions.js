import * as alt from 'alt-client';

class ESX {
    constructor() {
        this.playerData = {};
        this.playerLoaded = false;
        this.currentRequestId = 0;
        this.serverCallbacks = {};
    }

    isPlayerLoaded() {
        return this.playerLoaded;
    }

    getPlayerData() {
        return this.playerData;
    }

    setPlayerData(key, val) {
        const current = this.playerData[key];
        this.playerData[key] = val;
        if (key !== 'inventory' && key !== 'loadout') {
            if (typeof val === 'object' || val !== current) {
                alt.emit('esx:setPlayerData', key, val, current);
            }
        }
    }

    showNotification(message, type = 'info', length = 5000) {
        alt.emit('esx:showNotification', message, type, length);
    }

    showHelpNotification(message) {
        alt.emit('esx:showHelpNotification', message);
    }

    showFloatingHelpNotification(message, coords) {
        alt.emit('esx:showFloatingHelpNotification', message, coords);
    }

    progressBar(message, length) {
        alt.emit('esx:progressBar', message, length);
    }
}

class ESX {
    static Input = {};
    static ServerCallbacks = {};
    static CurrentRequestId = 0;

    static RegisterInput(commandName, label, inputGroup, key, onPress, onRelease) {
        const commandKey = onRelease ? `+${commandName}` : commandName;
        alt.on(commandKey, onPress);
        ESX.Input[commandName] = commandKey;
        if (onRelease) {
            alt.on(`-${commandName}`, onRelease);
        }
        // AltV ไม่มี RegisterKeyMapping เหมือน FiveM จำเป็นต้องใช้วิธีอื่นเพื่อกำหนดคีย์ลัด
    }

    static TriggerServerCallback(name, cb, ...args) {
        const invoke = alt.resourceName || "unknown";
        ESX.ServerCallbacks[ESX.CurrentRequestId] = cb;
        alt.emitServer('esx:triggerServerCallback', name, ESX.CurrentRequestId, invoke, ...args);
        ESX.CurrentRequestId = (ESX.CurrentRequestId < 65535) ? ESX.CurrentRequestId + 1 : 0;
    }

    static UI = {
        HUD: {
            RegisteredElements: [],

            SetDisplay(opacity) {
                alt.emit('setHUDDisplay', opacity);
            },

            RegisterElement(name, index, priority, html, data) {
                if (ESX.UI.HUD.RegisteredElements.includes(name)) return;
                
                ESX.UI.HUD.RegisteredElements.push(name);
                alt.emit('insertHUDElement', { name, index, priority, html, data });
                ESX.UI.HUD.UpdateElement(name, data);
            },

            RemoveElement(name) {
                const index = ESX.UI.HUD.RegisteredElements.indexOf(name);
                if (index !== -1) {
                    ESX.UI.HUD.RegisteredElements.splice(index, 1);
                    alt.emit('deleteHUDElement', name);
                }
            },

            Reset() {
                alt.emit('resetHUDElements');
                ESX.UI.HUD.RegisteredElements = [];
            },

            UpdateElement(name, data) {
                alt.emit('updateHUDElement', { name, data });
            }
        }
    }
}
const ESX = {
    UI: {
        Menu: {
            RegisteredTypes: {},
            Opened: [],

            RegisterType: function(type, open, close) {
                this.RegisteredTypes[type] = { open, close };
            },

            Open: function(type, namespace, name, data, submit, cancel, change, close) {
                let menu = {
                    type,
                    namespace,
                    name,
                    data,
                    submit,
                    cancel,
                    change,
                    close: function() {
                        ESX.UI.Menu.RegisteredTypes[type].close(namespace, name);
                        ESX.UI.Menu.Opened = ESX.UI.Menu.Opened.filter(m => !(m.type === type && m.namespace === namespace && m.name === name));
                        if (close) close();
                    },

                    update: function(query, newData) {
                        menu.data.elements.forEach(element => {
                            let match = Object.keys(query).every(key => element[key] === query[key]);
                            if (match) {
                                Object.assign(element, newData);
                            }
                        });
                    },

                    refresh: function() {
                        ESX.UI.Menu.RegisteredTypes[type].open(namespace, name, menu.data);
                    },

                    setElement: function(i, key, val) {
                        menu.data.elements[i][key] = val;
                    },

                    setElements: function(newElements) {
                        menu.data.elements = newElements;
                    },

                    setTitle: function(val) {
                        menu.data.title = val;
                    },

                    removeElement: function(query) {
                        menu.data.elements = menu.data.elements.filter(element => 
                            !Object.keys(query).every(key => element[key] === query[key])
                        );
                    }
                };

                ESX.UI.Menu.Opened.push(menu);
                ESX.UI.Menu.RegisteredTypes[type].open(namespace, name, data);
                return menu;
            },

            Close: function(type, namespace, name) {
                let menu = ESX.UI.Menu.GetOpened(type, namespace, name);
                if (menu) menu.close();
            },

            CloseAll: function() {
                ESX.UI.Menu.Opened.forEach(menu => menu.close());
                ESX.UI.Menu.Opened = [];
            },

            GetOpened: function(type, namespace, name) {
                return ESX.UI.Menu.Opened.find(m => m.type === type && m.namespace === namespace && m.name === name) || null;
            },

            GetOpenedMenus: function() {
                return ESX.UI.Menu.Opened;
            },

            IsOpen: function(type, namespace, name) {
                return !!ESX.UI.Menu.GetOpened(type, namespace, name);
            }
        }
    },

    ShowInventoryItemNotification: function(add, item, count) {
        alt.emit('inventoryNotification', { action: 'inventoryNotification', add, item, count });
    },

    Game: {
        GetPedMugshot: async function(ped, transparent) {
            if (!alt.Player.local.scriptID) return;
            let mugshot = transparent ? await RegisterPedheadshotTransparent(ped) : await RegisterPedheadshot(ped);
            while (!IsPedheadshotReady(mugshot)) {
                await alt.Utils.wait(0);
            }
            return { mugshot, txdString: GetPedheadshotTxdString(mugshot) };
        }
    }
};
class ESXGame {
    static async teleport(entity, coords, cb) {
        if (!entity || !native.doesEntityExist(entity)) return;
        
        const vector = coords instanceof alt.Vector4 ? coords :
                       coords instanceof alt.Vector3 ? new alt.Vector4(coords.x, coords.y, coords.z, 0.0) :
                       new alt.Vector4(coords.x, coords.y, coords.z, coords.heading || 0.0);
        
        native.requestCollisionAtCoord(vector.x, vector.y, vector.z);
        while (!native.hasCollisionLoadedAroundEntity(entity)) {
            await alt.Utils.wait(0);
        }
        
        native.setEntityCoords(entity, vector.x, vector.y, vector.z, false, false, false, false);
        native.setEntityHeading(entity, vector.w);
        
        if (cb) cb();
    }
    
    static async spawnObject(object, coords, cb, networked = true) {
        const model = typeof object === 'number' ? object : alt.hash(object);
        const vector = coords instanceof alt.Vector3 ? coords : new alt.Vector3(coords.x, coords.y, coords.z);
        
        await alt.Utils.requestModel(model);
        
        const obj = native.createObject(model, vector.x, vector.y, vector.z, networked, false, true);
        if (cb) cb(obj);
    }
    
    static spawnLocalObject(object, coords, cb) {
        this.spawnObject(object, coords, cb, false);
    }
    
    static deleteVehicle(vehicle) {
        native.setEntityAsMissionEntity(vehicle, true, true);
        native.deleteVehicle(vehicle);
    }
    
    static deleteObject(object) {
        native.setEntityAsMissionEntity(object, false, true);
        native.deleteObject(object);
    }
    
    static async spawnVehicle(vehicle, coords, heading, cb, networked = true) {
        const model = typeof vehicle === 'number' ? vehicle : alt.hash(vehicle);
        const vector = coords instanceof alt.Vector3 ? coords : new alt.Vector3(coords.x, coords.y, coords.z);
        
        await alt.Utils.requestModel(model);
        
        const veh = native.createVehicle(model, vector.x, vector.y, vector.z, heading, networked, true);
        
        if (networked) {
            const id = native.networkGetNetworkIdFromEntity(veh);
            native.setNetworkIdCanMigrate(id, true);
            native.setEntityAsMissionEntity(veh, true, true);
        }
        
        native.setVehicleHasBeenOwnedByPlayer(veh, true);
        native.setVehicleNeedsToBeHotwired(veh, false);
        native.setModelAsNoLongerNeeded(model);
        native.setVehRadioStation(veh, 'OFF');
        
        native.requestCollisionAtCoord(vector.x, vector.y, vector.z);
        while (!native.hasCollisionLoadedAroundEntity(veh)) {
            await alt.Utils.wait(0);
        }
        
        if (cb) cb(veh);
    }
    
    static spawnLocalVehicle(vehicle, coords, heading, cb) {
        this.spawnVehicle(vehicle, coords, heading, cb, false);
    }
    
    static isVehicleEmpty(vehicle) {
        return native.getVehicleNumberOfPassengers(vehicle) === 0 && native.isVehicleSeatFree(vehicle, -1);
    }
    
    static getObjects() {
        return native.getGamePool('CObject');
    }
    
    static getPeds(onlyOtherPeds = false) {
        const myPed = alt.Player.local.scriptID;
        const pool = native.getGamePool('CPed');
        
        return onlyOtherPeds ? pool.filter(ped => ped !== myPed) : pool;
    }
    
    static getVehicles() {
        return native.getGamePool('CVehicle');
    }
    
    static getPlayers(onlyOtherPlayers = false, returnKeyValue = false, returnPeds = false) {
        const players = {};
        const myPlayer = alt.Player.local;
        
        alt.Player.all.forEach(player => {
            if (!player || (onlyOtherPlayers && player === myPlayer)) return;
            
            if (returnKeyValue) {
                players[player.id] = player.scriptID;
            } else {
                players[player.id] = returnPeds ? player.scriptID : player;
            }
        });
        
        return returnKeyValue ? players : Object.values(players);
    }
}

alt.on('playerConnect', (player) => {
    console.log(`${player.name} has connected.`);
});
