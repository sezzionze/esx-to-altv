const ESX = {};
const Core = {
    RegisteredCommands: {},
    ServerCallbacks: {},
    PickupId: 65635,
    Pickups: {},
    ClientCallbacks: {},
    UsableItemsCallbacks: {},
    PlayerFunctionOverrides: {},
    TotalJobs: 0,
    TotalJobGrade: 0
};

ESX.Trace = function(msg) {
    if (Config.EnableDebug) {
        alt.log(`[KIMMIY] ${msg}`);
    }
};

ESX.RegisterCommand = function(name, group, cb, allowConsole, suggestion) {
    if (Array.isArray(name)) {
        name.forEach(v => ESX.RegisterCommand(v, group, cb, allowConsole, suggestion));
        return;
    }

    if (Core.RegisteredCommands[name]) {
        alt.log(`[WARNING] Command "${name}" already registered, overriding command`);
        if (Core.RegisteredCommands[name].suggestion) {
            alt.emit('chat:removeSuggestion', `/${name}`);
        }
    }

    if (suggestion) {
        if (!suggestion.arguments) suggestion.arguments = [];
        if (!suggestion.help) suggestion.help = '';
        alt.emit('chat:addSuggestion', `/${name}`, suggestion.help, suggestion.arguments);
    }

    Core.RegisteredCommands[name] = {group, cb, allowConsole, suggestion};

    alt.on('chatMessage', (playerId, args, rawCommand) => {
        let command = Core.RegisteredCommands[name];
        if (!command.allowConsole && playerId === 0) {
            alt.log(`[WARNING] Command cannot be executed from the console.`);
        } else {
            let xPlayer = ESX.Players[playerId];
            let error = null;

            if (command.suggestion && command.suggestion.validate) {
                if (args.length !== command.suggestion.arguments.length) {
                    error = `Argument mismatch: Expected ${command.suggestion.arguments.length} but got ${args.length}`;
                }
            }

            if (!error) {
                cb(xPlayer || false, args, (msg) => {
                    if (playerId === 0) {
                        alt.log(`[WARNING] ${msg}`);
                    } else {
                        xPlayer.showNotification(msg);
                    }
                });
            } else {
                if (playerId === 0) {
                    alt.log(`[WARNING] ${error}`);
                } else {
                    xPlayer.showNotification(error);
                }
            }
        }
    });
};

ESX.RegisterServerCallback = function(name, cb) {
    Core.ServerCallbacks[name] = cb;
};

ESX.TriggerServerCallback = function(name, requestId, source, Invoke, cb, ...args) {
    if (Core.ServerCallbacks[name]) {
        Core.ServerCallbacks[name](source, cb, ...args);
    } else {
        alt.log(`[ERROR] Server callback "${name}" does not exist. Please check ${Invoke} for errors!`);
    }
};

Core.SavePlayer = function(xPlayer, cb) {
    const parameters = [
        JSON.stringify(xPlayer.getAccounts(true)),
        xPlayer.job.name,
        xPlayer.job.grade,
        xPlayer.group,
        JSON.stringify(xPlayer.getCoords()),
        JSON.stringify(xPlayer.getInventory(true)),
        JSON.stringify(xPlayer.getLoadout(true)),
        xPlayer.identifier
    ];

    MySQL.prepare(
        'UPDATE `users` SET `accounts` = ?, `job` = ?, `job_grade` = ?, `group` = ?, `position` = ?, `inventory` = ?, `loadout` = ? WHERE `identifier` = ?',
        parameters,
        (affectedRows) => {
            if (affectedRows === 1) {
                alt.log(`[INFO] Saved player "${xPlayer.name}"`);
                alt.emit('esx:playerSaved', xPlayer.playerId, xPlayer);
            }
            if (cb) cb();
        }
    );
};

ESX.GetPlayers = function() {
    return GetPlayers();
};

ESX.GetPlayerFromId = function(source) {
    return ESX.Players[Number(source)];
};

ESX.GetPlayerFromIdentifier = function(identifier) {
    return Core.playersByIdentifier[identifier];
};

ESX.GetIdentifier = function(playerId) {
    const fxDk = alt.getConvarInt('sv_fxdkMode', 0);
    if (fxDk === 1) {
        return "ESX-DEBUG-LICENCE";
    }
    for (let v of alt.getPlayerIdentifiers(playerId)) {
        if (v.startsWith('steam:')) {
            return v;
        }
    }
    return null;
};

ESX.GetVehicleType = function(Vehicle, Player, cb) {
    Core.CurrentRequestId = Core.CurrentRequestId < 65535 ? Core.CurrentRequestId + 1 : 0;
    Core.ClientCallbacks[Core.CurrentRequestId] = cb;
    alt.emit("esx:GetVehicleType", Player, Vehicle, Core.CurrentRequestId);
};

ESX.DiscordLog = function(name, title, color, message) {
    const webHook = Config.DiscordLogs.Webhooks[name] || Config.DiscordLogs.Webhooks.default;
    const embedData = [{
        'title': title,
        'color': Config.DiscordLogs.Colors[color] || Config.DiscordLogs.Colors.default,
        'footer': {
            'text': `| ESX Logs | ${new Date()}`,
            'icon_url': "https://cdn.discordapp.com/attachments/944789399852417096/1020099828266586193/blanc-800x800.png"
        },
        'description': message,
        'author': {
            'name': "ESX Framework",
            'icon_url': "https://cdn.discordapp.com/emojis/939245183621558362.webp?size=128&quality=lossless"
        }
    }];
    alt.emit('PerformHttpRequest', webHook, null, 'POST', JSON.stringify({
        username: 'Logs',
        embeds: embedData
    }), {
        'Content-Type': 'application/json'
    });
};

// More functions are to be implemented similarly.
