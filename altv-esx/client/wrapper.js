import * as alt from 'alt-server';

const Chunks = {};

alt.onClient('__chunk', (player, data) => {
    if (!Chunks[data.id]) {
        Chunks[data.id] = '';
    }
    
    Chunks[data.id] += data.chunk;

    if (data.end) {
        try {
            const msg = JSON.parse(Chunks[data.id]);
            alt.emit(`${alt.resourceName}:message:${data.__type}`, player, msg);
        } catch (err) {
            console.error('JSON parse error:', err);
        }
        
        delete Chunks[data.id];
    }
});
