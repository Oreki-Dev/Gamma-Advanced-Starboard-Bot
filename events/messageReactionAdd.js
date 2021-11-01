const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",
  run: async (client, reaction, user) => {
    if (reaction.emoji.name !== "⭐") return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    let { message } = reaction;

    let channel = await client.db.get(`${reaction.message.guild.id}.schannel`);
    let stars =
      (await client.db.get(`${reaction.message.guild.id}.stars`)) || 3;

    if (!channel) return;
    channel = client.channels.cache.get(channel);
    if (!channel) return;

    //const reaction = message.reactions.cache.get("⭐");
    if (reaction && reaction.count < stars) return;

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

      const count =
        reaction && reaction.count ? reaction.count : parseInt(stars[2]) + 1;

      const starEmbed = new MessageEmbed()
        .setColor("BLURPLE")
        .setDescription(foundStar.description || "")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`⭐ ${count} | ${message.id}`)
        .setImage(image);
      const starMsg = await channel.messages.fetch(starMessage.id);

      await starMsg.edit({ embeds: [starEmbed] }).catch(() => {});
    } else {
      let embedImage = "";
      let embedContent = "";

      if (message.embeds.length > 0) {
        if (message.embeds[0].footer && message.embeds[0].footer.text) {
          const alreadyInStarboard = !!fetchedMessages.find(
            (m) =>
              m.embeds[0] &&
              m.embeds[0].footer &&
              m.embeds[0].footer.text.startsWith("⭐") &&
              m.embeds[0].footer.text.endsWith(
                message.embeds[0].footer.text.split(" | ")[1]
              )
          );
          if (alreadyInStarboard) return;
        }
        embedImage = message.embeds[0].image;
        embedContent = message.embeds[0].description;
      }

      let content = "";
      if (message.cleanContent)
        content =
          message.cleanContent.length > 2000
            ? message.cleanContent.slice(0, 2000) + "\n..."
            : message.cleanContent;
      else content = embedContent ? embedContent : "";

      const starEmbed = new MessageEmbed()
        .setColor("BLURPLE")
        .setDescription(`${content}`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(
          `⭐ ${reaction && reaction.count ? reaction.count : stars} | ${
            message.id
          }`
        );

      if (message.attachments.size) {
        starEmbed.setImage(message.attachments.first().proxyURL);
      }

      channel.send({ content: `${message.url}`, embeds: [starEmbed] });
    }
  },
};
