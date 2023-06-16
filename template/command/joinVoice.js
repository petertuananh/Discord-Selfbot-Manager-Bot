client.guilds.fetch(client.channels.fetch('channelIdInput')?.guild?.id)
.then(guild => {
    if (!guild) return;
    guild.channels.cache.get('channelIdInput').then(channel => {
        if (!channel) return;
        if (channel.type == Discord.ChannelType.GuildVoice && channel.joinable) channel.join();
    })
});