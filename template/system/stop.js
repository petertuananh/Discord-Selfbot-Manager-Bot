const fs = require('fs');
const { exec, spawn } = require('node:child_process');
const prods = require('./prods.json').prods;
const rimraf = require("rimraf");

prods.forEach(prod => {
    exec(`sudo lsof -i TCP:${prod.port}`, async (err, stdout, stderr) => {
        
        rimraf.sync(`./prods/${prods.dirName}`);
    })
    
})
fs.readdir(`./temp`, (err, files) => {
    files.forEach(file => {
        fs.unlinkSync(`./temp/${file}`);
    });
});