const ESX = {};
ESX.Table = {};

// nil proof alternative to #table
ESX.Table.SizeOf = function (t) {
    return Object.keys(t).length;
};

ESX.Table.Set = function (t) {
    return new Set(t);
};

ESX.Table.IndexOf = function (t, value) {
    return t.indexOf(value);
};

ESX.Table.LastIndexOf = function (t, value) {
    return t.lastIndexOf(value);
};

ESX.Table.Find = function (t, cb) {
    return t.find(cb) || null;
};

ESX.Table.FindIndex = function (t, cb) {
    return t.findIndex(cb);
};

ESX.Table.Filter = function (t, cb) {
    return t.filter(cb);
};

ESX.Table.Map = function (t, cb) {
    return t.map(cb);
};

ESX.Table.Reverse = function (t) {
    return [...t].reverse();
};

ESX.Table.Clone = function (t) {
    return JSON.parse(JSON.stringify(t));
};

ESX.Table.Concat = function (t1, t2) {
    return [...t1, ...t2];
};

ESX.Table.Join = function (t, sep = ',') {
    return t.join(sep);
};

ESX.Table.Sort = function (t, order) {
    let keys = Object.keys(t);
    
    if (order) {
        keys.sort((a, b) => order(t, a, b) ? -1 : 1);
    } else {
        keys.sort();
    }
    
    let index = 0;
    return function () {
        if (index < keys.length) {
            let key = keys[index];
            index++;
            return { key, value: t[key] };
        }
        return null;
    };
};
