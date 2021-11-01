module.exports = {
  name: "starboard-channel-reset",
  description: "Reset The Starboard Channel",
  authorPermission: ["MANAGE_GUILD"],
  run: async (client, interaction) => {
    let data = await client.db.get(`${interaction.guild.id}.schannel`);
    if (!data)
      return client.embeds.error(
        interaction,
        "Starboard Channel Doesn't Exist"
      );

    await client.db.delete(`${interaction.guild.id}.schannel`);
    return client.embeds.success(interaction, "Starboard Channel Deleted");
  },
};
