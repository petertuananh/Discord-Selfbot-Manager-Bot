const Discord = require('discord.js');
const ascii = require("ascii-table");
const client = require('../../index');
const dateformat = require('dateformat');
module.exports = {
    name: "account",
    description: "Account manager",
    ownerOnly: false,
    BotPerms: [],
    options: [
        {
            name: "view",
            description: "See accounts info",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "all",
                    description: "All",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
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
                    ],
                },
                {
                    name: "token",
                    description: "By Token",
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'token',
                            description: 'Account Token',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                }
            ],
        },
        {
            name: "add",
            description: "Add an account",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'Account ID',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'token',
                    description: 'Account Token',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
            ],
        },
        {
            name: "remove",
            description: "Remove an account",
            type: Discord.ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'id',
                    description: 'Account ID',
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Account ID',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                },
                {
                    name: 'token',
                    description: 'Account Token',
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'token',
                            description: 'Account Token',
                            type: Discord.ApplicationCommandOptionType.String,
                            required: true
                        },
                    ],
                },
            ],
        }
    ],
    run: async (client, interaction) => {
        const groupName = interaction.options._group;
        const subCommand = interaction.options.getSubcommand();
        const id = interaction.options.getString('id');
        const token = interaction.options.getString('token');
        const everyone = await interaction.guild.roles.cache.find((role) => role.name === "@everyone");
        const user = await interaction.guild.members.fetch(interaction.member.id);
        if (groupName == 'view') {
            if (subCommand == 'all') {
                client.mysql.query(`SELECT * FROM user_token`, async function (err, data) {
                    const content = data.map(x => `${x.user_id}|${x.token}|${x.refresh_token}|${dateformat(parseInt(x.createAt), 'd/m/yyyy h:MM TT')}`).join("\n")
                    if (content.length < 200) return interaction.followUp(`\`\`\`${content}\`\`\``);
                    return fs.writeFile(`./cache/tokens.txt`, content, s => {
                        return interaction.followUp({ files: [new Discord.AttachmentBuilder().setFile(`./cache/tokens.txt`)] })
                    })
                })
            } else if (subCommand == 'id') {
                client.mysql.query(`SELECT * FROM user_token WHERE user_id = ${id}`, async function (err, data) {
                    if (!data?.[0]) return interaction.followUp({
                        content: `> \`❌\` Account does not exist!`
                    });
                    return interaction.followUp(`\`\`\`${data?.[0]?.user_id}|${data?.[0]?.token}|${data?.[0]?.refresh_token}|${dateformat(parseInt(data?.[0]?.createAt), 'd/m/yyyy h:MM TT')}\`\`\``);
                })
            } else if (subCommand == 'token') {
                client.mysql.query(`SELECT * FROM user_token WHERE token = '${token}'`, async function (err, data) {
                    if (!data?.[0]) return interaction.followUp({
                        content: `> \`❌\` Account does not exist!`
                    });
                    return interaction.followUp(`\`\`\`${data?.[0]?.user_id}|${data?.[0]?.token}|${data?.[0]?.refresh_token}|${dateformat(parseInt(data?.[0]?.createAt), 'd/m/yyyy h:MM TT')}\`\`\``);
                })
            }
        } else if (subCommand == 'add') {
            client.mysql.query(`SELECT * FROM user_token WHERE user_id = ${id}`, async function (err, data) {
                if (data?.[0]) return interaction.followUp({
                    content: `> \`❌\` Account exist!`
                });
                client.mysql.query(`SELECT * FROM user_token WHERE token = '${token}'`, async function (err, data2) {
                    if (data2?.[0]) return interaction.followUp({
                        content: `> \`❌\` Account exist!`
                    });
                    client.mysql.query(`INSERT INTO user_token(user_id, token, refresh_token, createAt) VALUES (${id}, '${token}', 0, ${Date.now()})`, e => {
                        if (!e) return interaction.followUp({
                            content: `> \`✅\` Operation successfully!`
                        });
                        return interaction.followUp({
                            content: `> \`❌\` Operation failed!`
                        });
                    })
                })
            })
        } else if (groupName == 'remove') {
            if (subCommand == 'id') {
                client.mysql.query(`SELECT * FROM user_token WHERE user_id = ${id}`, async function (err, data) {
                    if (!data?.[0]) return interaction.followUp({
                        content: `> \`❌\` Account does not exist!`
                    });
                    client.mysql.query(`DELETE FROM user_token WHERE user_id = ${id})`, e => {
                        if (!e) return interaction.followUp({
                            content: `> \`✅\` Operation successfully!`
                        });
                        return interaction.followUp({
                            content: `> \`❌\` Operation failed!`
                        });
                    })
                })
            } else if (subCommand == 'token') {
                client.mysql.query(`SELECT * FROM user_token WHERE token = '${token}'`, async function (err, data) {
                    if (!data?.[0]) return interaction.followUp({
                        content: `> \`❌\` Account does not exist!`
                    });
                    client.mysql.query(`DELETE FROM user_token WHERE token = '${token}'`, e => {
                        if (!e) return interaction.followUp({
                            content: `> \`✅\` Operation successfully!`
                        });
                        return interaction.followUp({
                            content: `> \`❌\` Operation failed!`
                        });
                    })
                })
            }
        }
    }
}