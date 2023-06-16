client.fetchInvite('inviteURLInput').then(async invite => {
    invite.acceptInvite()
    .then(r => {
        functions.writeLog.account({ content: `${client.user.tag} accepted invite 'inviteURLInput'` });
    }).catch(e=>{
        functions.writeLog.account({ content: `${client.user.tag} failed to accept invite 'inviteURLInput'` });
    });
})
client.acceptInvite('inviteURLInput')