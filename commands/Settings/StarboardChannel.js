module.exports = {
  name: "starboard-channel",
  description: "Set The Starboard Channel",
  authorPermission: ["MANAGE_GUILD"],
  options: [
    {
      type: "CHANNEL",
      name: "channel",
      description: "The Channel You Want To Set As Starboard Channel",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let channel = interaction.options.getChannel("channel");
    if (channel.type !== "GUILD_TEXT")
      return client.embeds.error(interaction, "Channel Must Be A Text Channel");

    let data = await client.db.get(`${interaction.guild.id}.schannel`);

    if (data && data === channel.id)
      return client.embeds.error(
        interaction,
        "That Channel Is Already Set As Starboard Channel"
      );

    await client.db.set(`${interaction.guild.id}.schannel`, channel.id);
    return client.embeds.success(
      interaction,
      "Channel Set As Starboard Channel"
    );
  },
};
