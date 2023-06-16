const { DisTube } = require('distube');
const Discord = require('discord.js');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YouTubeDLPlugin } = require("@distube/yt-dlp")
const cookie = require('../config.json')
const Format = Intl.NumberFormat();
let spotifyoptions = {
    parallel: true,
    emitEventsAfterFetching: false
};
module.exports = (client) => {
    client.distube = new DisTube(client, {
        leaveOnStop: false,
        leaveOnEmpty: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: true,
        youtubeCookie: `${cookie}`,
        plugins: [
            new SpotifyPlugin(spotifyoptions),
            new SoundCloudPlugin()
        ]
    })
    // if(config.spotifyapi.enabled) {
    //     spotifyoptions.api = {
    //         clientId: client.user.id,
    //         clientSecret: client.config.discord.secret,
    //     }
    // }
    const volume = 50;

    const status = queue => `Volume: \`${queue.volume + volume}%\` | Repeat: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Playlist' : 'Songs') : 'Off'
        }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

    client.distube.on('addSong', async (queue, song) => {
        const msg = await queue.textChannel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor('Aqua')
                    .setAuthor({ name: 'Add Songs', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                    .setDescription(`[${song.name}](${song.url})`)
                    .setThumbnail(song.thumbnail)
                    .setFields(
                        {
                            name: "Status",
                            value: `${status(queue).toString()}`,
                            inline: false
                        },
                        {
                            name: "Views",
                            value: `${Format.format(song.views)}`,
                            inline: true
                        },
                        {
                            name: "Like",
                            value: `${Format.format(song.dislikes)}`,
                            inline: true
                        },
                        {
                            name: "Duration:",
                            value: `${song.formattedDuration}`,
                            inline: true
                        },
                        {
                            name: "Requested By:",
                            value: `${song.user}`,
                            inline: true
                        }
                    )
            ]
        })
        return msg.react(`✅`)
    })

    client.distube.on('addList', async (queue, playlist) => {
        const msg = await queue.textChannel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor('Aqua')
                    .setAuthor({ name: 'Adding playlist', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                    .setDescription(`${playlist.user} Add [${playlist.name}](${playlist.url}) (${playlist.songs.length} bài hát) vào danh sách phát`)
                    .setThumbnail(playlist.thumbnail)
                    .setFields(
                        {
                            name: "Status",
                            value: `${status(queue).toString()}`,
                            inline: false
                        },
                        {
                            name: "Duration:",
                            value: `${song.formattedDuration}`,
                            inline: true
                        },
                        {
                            name: "Requested By:",
                            value: `${song.user}`,
                            inline: true
                        }
                    )
            ]
        })
        return msg.react(`➕`)
    })
    client.distube
        .on('playSong', async (queue, song) => {

            const msg = await queue.textChannel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor('Aqua')
                        .setAuthor({ name: 'Now playing', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                        .setDescription(`[${song.name}](${song.url})`)
                        .setThumbnail(song.thumbnail)
                        .setFields(
                            {
                                name: "Status",
                                value: `${status(queue).toString()}`,
                                inline: false
                            },
                            {
                                name: "Posted by:",
                                value: `[${song.uploader.name}](${song.uploader.url})`,
                                inline: true
                            },
                            {
                                name: "Views",
                                value: `${Format.format(song.views)}`,
                                inline: true
                            },
                            {
                                name: "Like",
                                value: `${Format.format(song.dislikes)}`,
                                inline: true
                            },
                            {
                                name: "Duration:",
                                value: `${song.formattedDuration}`,
                                inline: true
                            },
                            {
                                name: "Downloaded:",
                                value: `[Nhấn để tải video về](${song.streamURL})`,
                                inline: true
                            },
                            {
                                name: "Requested By:",
                                value: `${song.user}`,
                                inline: true
                            },
                            {
                                name: "Play music at:",
                                value: `┕${client.channels.cache.get(queue.voiceChannel.id)}┕${queue.voiceChannel.bitrate / 1000}  kbps`,
                                inline: false
                            }
                        )
                ]
            })
            return msg.react(`✅`)
        })
        .on('error', async (channel, e) => {
            channel.send(`| An error encountered: ${e.toString().slice(0, 1974)}`)
            console.error(e)
        })
        .on('empty', async channel => {
            const embed = new Discord.EmbedBuilder()
                .setColor('Aqua')
                .setAuthor({ name: 'Over', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription('End of songs in the list')
            const msg = await channel.send({ embeds: [embed] })
            return msg.react(`❌`)
        })
        .on('searchNoResult', async (message, query) => {
            const embed = new Discord.EmbedBuilder()
                .setColor('Aqua')
                .setAuthor({ name: 'Not found', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription(`No song found with keyword \`${query}\``)
            const msg = await message.channel.send({ embeds: [embed] })
            return msg.react(`❌`)
        })
        .on('finish', async queue => {
            const embed = new Discord.EmbedBuilder()
                .setColor('Aqua')
                .setAuthor({ name: 'End', iconURL: 'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif' })
                .setDescription('End of songs in the list')
            const msg = await queue.textChannel.send({ embeds: [embed] })
            return msg.react(`❌`)
        })
}