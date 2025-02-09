const ESX = {};

ESX.Math = {
    Round: (value, numDecimalPlaces) => {
        if (numDecimalPlaces !== undefined) {
            const power = Math.pow(10, numDecimalPlaces);
            return Math.floor((value * power) + 0.5) / power;
        } else {
            return Math.floor(value + 0.5);
        }
    },

    GroupDigits: (value) => {
        if (typeof value !== 'string') value = value.toString();
        const match = value.match(/^([^\d]*\d)(\d*)(.-)$/);
        
        if (!match) return value;

        const left = match[1];
        const num = match[2];
        const right = match[3];
        
        return left + num.split('').reverse().join('').replace(/(\d{3})/g, '$1' + TranslateCap('locale_digit_grouping_symbol')).split('').reverse().join('') + right;
    },

    Trim: (value) => {
        return value ? value.trim() : null;
    }
};
