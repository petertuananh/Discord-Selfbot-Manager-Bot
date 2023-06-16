const client = require('../../index');
const Discord = require('discord.js');

client.on('ready', async () => {
    console.log(`Logged in at ${client.user.tag}`)
    client.user.setActivity(client.config.client.presence.activity);
    client.user.setPresence({
        activities: [
            {
                name: 'the third eye 👀',
                type: Discord.ActivityType.Streaming,
                url: 'https://www.twitch.tv/petertuananh',
            },
        ],
        // status: 'online'
    });
})

