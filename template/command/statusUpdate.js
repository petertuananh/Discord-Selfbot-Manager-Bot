con.query(`UPDATE user SET \`presence.status\` = 'newStatusInput' WHERE token='userTokenInput'`);
client.user.setStatus('newStatusInput');
functions.writeLog.account({ content: `${client.user.tag}'s status is set to 'newStatusInput'` });