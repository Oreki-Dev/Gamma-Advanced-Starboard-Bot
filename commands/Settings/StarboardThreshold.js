module.exports = {
  name: "starboard-threshold",
  description: "Set The Number Of Stars Required",
  authorPermission: ["MANAGE_GUILD"],
  options: [
    {
      type: "INTEGER",
      name: "number",
      description: "The Number Of Required Stars",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let number = interaction.options.getInteger("number");
    let data = (await client.db.get(`${interaction.guild.id}.stars`)) || 3;

    if (data && data === number)
      return client.embeds.error(
        interaction,
        "Threshold Is Already Set As That Number"
      );

    await client.db.set(`${interaction.guild.id}.stars`, number);
    return client.embeds.success(interaction, "Threshold Changed");
  },
};
