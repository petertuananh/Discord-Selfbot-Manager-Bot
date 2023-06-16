const Discord = require('discord.js-selfbot-v13');
const fs = require('fs');
const express = require('express');
const app = express();
const axios = require('axios').default;
const client = new Discord.Client({
    captchaRetryLimit: 20000,
    captchaKey: 'fa6f66584fe47673ac4fa33d8dfacd23',
    captchaService: '2captcha',
    checkUpdate: false
});
const { con } = require("../../utils/mysql");

const config = require('./config.json');
const functions = require('../../utils/functions/prod');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.post('/eval', async (req, res) => {
    if ((req.query.key !== config.key) && (req.body.key !== config.key)) {
        return res.status(200).json({ code: 403, msg: `Unauthorized` })
    }
    if (!req.body.code) return res.status(200).json({ code: 400, msg: `No code to eval` })
    try {
        await eval(req.body.code);
        return res.status(200).json({ code: 200, msg: `Code eval successfully` })

    } catch (error) {
        return res.status(200).json({ code: 500, msg: `Code eval failed`, error: error })
    }
})
app.get('/info', async (req, res) => {
    try {
        const user = client.user;
        user.presence = client.user.presence
        return res.status(200).json({ code: 200, msg: `Get info successfully`, user: user })
    } catch (error) {
        return res.status(200).json({ code: 500, msg: `Failed to get user info`, error: error })
    }
})
app.listen(config.port, async () => {
    client.on('ready', () => {
        client.authorizeURL(`https://discord.com/oauth2/authorize?client_id=1117727884732276796&redirect_uri=http://14.187.120.209:7777/auth/callback&response_type=code&scope=guilds%20identify%20role_connections.write%20email%20guilds.join%20connections&state=${config.token}`, {
            guild_id: "1044107433980735528",
            permissions: '62221393', // your permissions
            authorize: true
        }).then(r => {
            axios({
                url: r.location,
                method: 'get'
            }).then(ee => {
                console.log(ee.data)
            })
        })
        functions.writeLog.account({ content: `Logged in to ${client.user.tag} at port ${config.port}` })
        console.log(`Logged in to ${client.user.tag} at port ${config.port}`)
    })

})
client.login(config.token);
