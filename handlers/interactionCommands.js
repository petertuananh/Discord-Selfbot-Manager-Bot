const fs = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Interaction Commands');
table.setHeading('List', ' Status');

module.exports = (client) => {
    let interactionCommands = []
	fs.readdirSync('./commands').forEach(dir => {
		const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

		for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.interactionCommands.set(pull.name, pull);
                interactionCommands.push(pull);
                table.addRow(file, `Success ✔`);
                continue;
            } else {
                table.addRow(file, `Error ✖`);
                continue;
            }
		}
	});
    console.log(table.toString());

    client.on('ready', async () => {
        await client.application.commands.set(interactionCommands)
    })
};