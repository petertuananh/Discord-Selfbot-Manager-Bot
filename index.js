const
    Discord = require('discord.js'),
    config = require('./config.json'),
    { con } = require('./utils/mysql'),
    fs = require('fs');
const express = require('express');
const app = express();
const editJsonFile = require("edit-json-file");
const randomString = require('randomstring');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fse = require('fs-extra');
const rimraf = require("rimraf");

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
    clientId: config.client.id,
    clientSecret: config.client.secret,
    redirectUri: config.client.callbackURL
});
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildIntegrations,
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.User,
        Discord.Partials.GuildMember,
        Discord.Partials.Reaction,
    ],
    shards: config.client.shards,
    allowedMentions: [

    ],
    // ws: {
    //     large_threshold: 250,
    //     // compress: require('os').platform() !== 'browser',
    //     properties: {
    //         $os: process ? process.platform : 'discord.js',
    //         $browser: 'Discord iOS',
    //         $device: 'discord.js',
    //         $referrer: '',
    //         $referring_domain: '',
    //     },
    //     version: 6,
    // },
});


module.exports = client;
client.config = config
client.mysql = con
client.oauth = oauth
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Discord.Collection();
client.delay = ms => new Promise(res => setTimeout(res, ms));
client.interactions = new Discord.Collection();
client.prefixCommands = new Discord.Collection();
client.interactionCommands = new Discord.Collection();

const res = fs.readdirSync('./handlers');
res.map(name => require(`./handlers/${name}`)(client));
client.login(config.client.token);



app.get('/auth/callback', async (req, res) => {
    console.log(req.query)
    if (!req.query.code) return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.client.id}&redirect_uri=${config.client.callbackURL}&response_type=code&scope=guilds%20identify%20role_connections.write%20email%20guilds.join%20connections`)
    const tokenRequest = await oauth.tokenRequest({
        code: req.query.code,
        scope: "role_connections.write guilds.join identify guilds connections email",
        grantType: "authorization_code",
    });
    const user = await oauth.getUser(tokenRequest.access_token);
    con.query(`SELECT * FROM user_token WHERE user_id = ${user.id}`, async function (err, data) {
        if (!data[[0]]) {
            con.query(`INSERT INTO user_token(user_id, token, refresh_token, createAt) VALUES (${user.id}, '${req.query.state}', '${tokenRequest.refresh_token}', ${Date.now()})`, e => {
                if (!e) return res.send(`✅ Xác minh thành công`);
                return res.send('❌ Không thể xác minh tài khoản');
            })
        } else {
            con.query(`UPDATE user_token SET refresh_token='${tokenRequest.refresh_token}', token='${req.query.state}', createAt=${Date.now()} WHERE user_id = ${user.id}`, e => {
                if (!e) return res.send(`✅ Xác minh thành công`);
                return res.send('❌ Không thể xác minh tài khoản');
            })
        }
    })

})


app.listen(config.server.port, () => {
    console.log(`Server is at port ${config.server.port}`)
})

fs.readdir(`./prods`, (err, folders) => {
    folders.forEach(folder => {
        rimraf.sync(`./prods/${folder}`);
    });
});
const tokens = fs.readFileSync('./tokens.txt', 'utf8');
fse.copyFileSync(`./template/system/start.js`, `./temp/start.js`);
fse.copyFileSync(`./template/system/stop.js`, `./temp/stop.js`);

fse.copyFileSync(`./template/system/prods.json`, `./temp/prods.json`);
let counter = 0
tokens.split(/\r?\n/).forEach(async line => {
    const folderId = randomString.generate(10)
    if (!fs.existsSync(`./prods/${folderId}`)) {
        fs.mkdirSync(`./prods/${folderId}`);
        fse.copySync(`./template/selfbot`, `./prods/${folderId}`, {
            overwrite: true
        })
        const port = `${randomString.generate({
            length: 4,
            charset: `numeric`
        })}`
        let configFile = editJsonFile(`./prods/${folderId}/config.json`);
        configFile.set("token", line);
        configFile.set("key", client.config.statics.secretKey);
        configFile.set("port", port)
        configFile.save();

        let portFile = editJsonFile(`./temp/prods.json`);
        portFile.append("prods", { id: randomString.generate({ charset: 'numeric', length: 10 }), dirName: folderId, port: port, token: line });
        portFile.save();



        // fs.writeFile(`./prods/${folderId}/config.json`, `{"token": "${line}"}`, err => {

        // });
    }
});
require('./temp/start');