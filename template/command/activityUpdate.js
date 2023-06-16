con.query(`UPDATE user SET \`presence.activity\` = 'newActivityInput' WHERE token='userTokenInput'`);
client.user.setActivity('newActivityInput');
functions.writeLog.account({ content: `${client.user.tag}'s activity is set to 'newActivityInput'` });