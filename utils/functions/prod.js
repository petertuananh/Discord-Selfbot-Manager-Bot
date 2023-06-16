const fs = require('fs');
const dateformat = require('dateformat');
module.exports = {
    writeLog: {
        account: async function (data) {
            fs.writeFileSync(`./logs/account.txt`, `[${dateformat(Date.now() - 1000, 'h:MM TT')}]: ${data.content}\n`, { flag: "a+", encoding: "utf-8" });
        },
        dashboard: async function (data) {
            fs.writeFileSync(`./logs/dashboard.txt`, `[${dateformat(Date.now() - 1000, 'h:MM TT')}]: ${data.content}\n`, { flag: "a+", encoding: "utf-8" });
        },
        invalidToken: async function (data) {
            fs.writeFileSync(`./logs/invalidToken.txt`, `[${dateformat(Date.now() - 1000, 'h:MM TT')}]: ${data.content}\n`, { flag: "a+", encoding: "utf-8" });
        },
        prodErr: async function (data) {
            fs.writeFileSync(`./logs/prodErr.txt`, `[${dateformat(Date.now() - 1000, 'h:MM TT')}]: ${data.content}\n`, { flag: "a+", encoding: "utf-8" });
        },
        prodOut: async function (data) {
            fs.writeFileSync(`./logs/prodOut.txt`, `[${dateformat(Date.now() - 1000, 'h:MM TT')}]: ${data.content}\n`, { flag: "a+", encoding: "utf-8" });
        },
        system: async function (data) {
            fs.writeFileSync(`./logs/system.txt`, `[${dateformat(Date.now() - 1000, 'h:MM TT')}]: ${data.content}\n`, { flag: "a+", encoding: "utf-8" });
        },
    },
};