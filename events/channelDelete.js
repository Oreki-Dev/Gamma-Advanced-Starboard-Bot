module.exports = {
  name: "channelDelete",
  run: async (client, channel) => {
    let data = await client.db.get(`${channel.guild.id}.schannel`);
    if (!data) return;

    if (data === channel.id)
      await client.db.delete(`${channel.guild.id}.schannel`);
  },
};
