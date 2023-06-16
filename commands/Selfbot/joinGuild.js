const Discord = require('discord.js');
const ascii = require("ascii-table");
const dateformat = require('dateformat');
const client = require('../../index');
module.exports = {
    name: "join",
    description: "Join accounts to",
    ownerOnly: false,
    BotPerms: [],
    options: [
        {
            name: "voice",
            description: "To a voice channel",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "all",
                    description: "All",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'voiceid',
                            description: 'Voice ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                },
                {
                    name: "id",
                    description: "By ID",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Account ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'voiceid',
                            description: 'Voice ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                },
                {
                    name: "amount",
                    description: "Amount",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'Account amount',
                            type: Discord.ApplicationCommandOptionType.Number,
                            required: true
                        },
                        {
                            name: 'voiceid',
                            description: 'Voice ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                }
            ],
        },
        {
            name: "guild",
            description: "To a guild",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "all",
                    description: "All",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'guildid',
                            description: 'Guild ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                },
                {
                    name: "id",
                    description: "By ID",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Account ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'guildid',
                            description: 'Guild ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                },
                {
                    name: "amount",
                    description: "Amount",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'Account amount',
                            type: Discord.ApplicationCommandOptionType.Number,
                            required: true
                        },
                        {
                            name: 'guildid',
                            description: 'Guild ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                }
            ],
        },
    ],
    run: async (client, interaction) => {
        const groupName = interaction.options._group;
        const subCommand = interaction.options.getSubcommand();
        const id = interaction.options.getString('id');
        const guildId = interaction.options.getString('guildid');
        const voiceId = interaction.options.getString('voiceid');

        const token = interaction.options.getString('token');
        const everyone = await interaction.guild.roles.cache.find((role) => role.name === "@everyone");
        const user = await interaction.guild.members.fetch(interaction.member.id);
        if (groupName == 'voice') {

        } else if (groupName == 'guild') {
            if (subCommand == 'all') {
                client.mysql.query(`SELECT * FROM user_token`, async function (err, user_token) {
                    if (!user_token?.[0]) return interaction.followUp({
                        content: `> \`❌\` Account exist!`
                    });
                    await interaction.followUp({
                        content: `> \`✅\` Joining ...`
                    });
                    user_token.forEach(async (user) => {
                        const tokenRequest = await client.oauth.tokenRequest({
                            refreshToken: user.refresh_token,
                            grantType: "refresh_token",
                        });
                        client.mysql.query(`UPDATE user_token SET refresh_token='${tokenRequest.refresh_token}', createAt=${Date.now()} WHERE user_id = ${user.user_id}`)
                        client.oauth.addMember({
                            accessToken: tokenRequest.access_token,
                            botToken: client.config.client.token,
                            guildId: guildId,
                            userId: user.user_id,
                            // nickname: "Who knows",
                            // roles: ["1071311579838152754"],
                            // mute: true,
                            // deaf: true,
                        }).then(r => {
                            return interaction.editReply({
                                content: `> \`✅\` [\`${user.user_id}\`] Joinned`
                            });
                        }).catch((e) => {
                            return interaction.editReply({
                                content: `> \`❌\` [\`${user.user_id}\`] Failed to join`
                            });
                        })
                    })
                })
            }
        }
    }
}