const guild = await client.guilds.cache.get('guildIdInput');
if (guild) return guild.leave()
.then(r=> {
    functions.writeLog.account({ content: `${client.user.tag} left 'guildIdInput'` });
})
.catch(e=>{
    functions.writeLog.account({ content: `${client.user.tag} failed to leave 'guildIdInput'` });
});