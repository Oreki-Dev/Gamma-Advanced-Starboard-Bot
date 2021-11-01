const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "leaderboard",
  description: "Shows The Most Star'ed Messages",
  run: async (client, interaction) => {
    let channel = await client.db.get(`${interaction.guild.id}.schannel`);
    if (!channel)
      return client.embeds.error(interaction, "No Starboard For This Guild");
    channel = interaction.guild.channels.cache.get(channel);
    if (!channel)
      return client.embeds.error(
        interaction,
        "Starboard Doesn't Exist Anymore"
      );

    const fetchedMessages = await channel.messages.fetch({ limit: 100 });

    fetchedMessages
      .filter(
        (m) =>
          m.embeds[0] &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text.startsWith("⭐")
      )
      .map((m) => {
        const regex = new RegExp(`^⭐\\s([0-9]{1,3})\\s\\|\\s([0-9]{17,20})`);
        const star = regex.exec(m.embeds[0].footer.text);
        m.stars = parseInt(star[1]);
        if (m.embeds[0] && m.embeds[0].image && m.embeds[0].image.url)
          m.image = m.embeds[0] && m.embeds[0].image && m.embeds[0].image.url;
        m;
      })
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    const content = fetchedMessages.map(
      (m, i) =>
        `${m.stars} ⭐  -  ${
          m.embeds[0].description || `[Image](${m.embeds[0].image.url})`
        }`
    );

    const leaderboard = new MessageEmbed()
      .setTitle(`${interaction.guild.name}'s starboard`)
      .setColor(client.color(interaction))
      .setDescription(
        `${
          content.length > 0
            ? content.join("\n")
            : "```Nothing Yet In The Starboard```"
        }`
      );

    interaction.followUp({ embeds: [leaderboard] });
  },
};
