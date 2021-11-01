const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageReactionRemove",
  run: async (client, reaction, user) => {
    if (reaction.emoji.name !== "⭐") return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const { message } = reaction;

    let channel = await client.db.get(`${reaction.message.guild.id}.schannel`);
    let count =
      (await client.db.get(`${reaction.message.guild.id}.stars`)) || 3;

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
      const regex = new RegExp(
        `^(⭐|" ")?\\s?([0-9]{1,3})\\s\\|\\s([0-9]{17,20})`
      );
      const stars = regex.exec(starMessage.embeds[0].footer.text);
      const foundStar = starMessage.embeds[0];
      const image = (foundStar.image && foundStar.image.url) || "";

      const starEmbed = new MessageEmbed()
        .setColor("BLURPLE")
        .setDescription(foundStar.description || "")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(stars[2]) - 1} | ${message.id}`)
        .setImage(image);
      const starMsg = await channel.messages.fetch(starMessage.id);
      await starMsg.edit({ embeds: [starEmbed] }).catch(() => {});
      if (parseInt(stars[2]) - 1 == 0 || (reaction && reaction.count < count)) {
        setTimeout(() => {
          starMsg.delete().catch(() => {});
        }, 1000);
        return starMsg;
      }
    }
  },
};
