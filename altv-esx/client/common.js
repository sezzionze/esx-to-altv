import * as alt from 'alt-server';

const ESX = {}; // จำเป็นต้องใช้ระบบ ESX เวอร์ชันที่รองรับ Alt:V หรือสร้างระบบใหม่
const Config = { EnableDebug: true }; // แทนที่ด้วย Config ของคุณ

alt.onClient('esx:getSharedObject', (player, cb) => {
    if (Config.EnableDebug) {
        console.log(
            `[\x1b[31mERROR\x1b[0m] Player ${player.name} tried to use \x1b[35mgetSharedObject\x1b[0m event, but this event \x1b[31mno longer exists!\x1b[0m`
        );
    }
    alt.emitClient(player, cb, ESX); // ส่ง ESX กลับไปยัง Client
});

// สร้าง Export ฟังก์ชันให้สามารถใช้ได้ในโมดูลอื่น
export function getSharedObject() {
    return ESX;
}

alt.log('ESX Shared Object system initialized!');