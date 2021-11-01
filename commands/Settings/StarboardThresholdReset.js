module.exports = {
  name: "starboard-threshold-reset",
  description: "Reset The Starboard Star Requirements",
  authorPermission: ["MANAGE_GUILD"],
  run: async (client, interaction) => {
    let data = await client.db.get(`${interaction.guild.id}.stars`);
    if (!data)
      return client.embeds.error(
        interaction,
        "Required Stars Are Already Set At Default"
      );

    await client.db.delete(`${interaction.guild.id}.stars`);
    return client.embeds.success(
      interaction,
      "Starboard Stars Requirements Deleted"
    );
  },
};
