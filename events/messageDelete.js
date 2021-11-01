const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageDelete",
  run: async (client, message) => {
    let channel = await client.db.get(`${message.guild.id}.schannel`);
    if (!channel) return;

    channel = client.channels.cache.get(channel);
    if (!channel) return;

    const fetchedMessages = await channel.messages.fetch({ limit: 100 });
    const starMessage = fetchedMessages.find(
      (m) =>
        m.embeds[0] &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text.endsWith(message.id) &&
        m.author.id === client.user.id
    );

    if (starMessage) {
      const foundStar = starMessage.embeds[0];
      const image = (foundStar.image && foundStar.image.url) || "";
      const starEmbed = new MessageEmbed()
        .setColor("BLURPLE")
        .setDescription(foundStar.description || "")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`⭐ 0 | ${message.id}`)
        .setImage(image);
      const starMsg = await channel.messages.fetch(starMessage.id);
      await starMsg.edit({ embeds: [starEmbed] });

      setTimeout(() => {
        starMsg.delete();
      }, 1000);

      return starMsg;
    }
  },
};
