const client = require('../../index');
const Discord = require("discord.js");
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false });
        const args = [];
        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach(x => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        const command = client.interactionCommands.get(interaction.commandName);
        if (!command) return;
        if (!client.config.statics.executor.includes(interaction.member.id)) {
            return interaction.editReply({
                content: `> \`❌\` Missing permission`
            });
        }
        return command.run(client, interaction, args);
    }
})