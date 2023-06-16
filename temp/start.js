const fs = require('fs');
const { exec, spawn } = require('node:child_process');
const functions = require('../utils/functions/prod')

fs.readdir(`./prods`, (err, folders) => {
    folders.forEach(folder => {
        exec(`node ./prods/${folder}/client.js`, (err, stdout, stderr) => {
            try {
                const token = require(`../prods/${folder}/config.json`).token;
                functions.writeLog.prodOut({ content: `Token ${token}:\n${stdout}` });
                if (err) {
                    functions.writeLog.prodErr({ content: `Token ${token}:\n${err}` });
                    if (err.message.includes(`TOKEN_INVALID`)) {
                        functions.writeLog.invalidToken({ content: `${token}` })
                        var data = fs.readFileSync(`./data/tokens.txt`, 'utf-8');
                        var newValue = data.replace(token, '');
                        fs.writeFileSync(`./data/tokens.txt`, newValue, 'utf-8');
                    }
                }
            } catch (error) {

            }
        });
    });

});
