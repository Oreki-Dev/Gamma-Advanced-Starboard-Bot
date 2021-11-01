const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "settings",
  description: "View The Settings Of The Guild",
  authorPermission: ["MANAGE_GUILD"],
  run: async (client, interaction) => {
    let schannel = await client.db.get(`${interaction.guild.id}.schannel`);
    let stars = await client.db.get(`${interaction.guild.id}.stars`);

    let embed = new MessageEmbed()
      .setTitle(`${interaction.guild.name} Settings`)
      .setColor(client.color(interaction))
      .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
      .addField(
        "Starboard Channel",
        `${
          schannel
            ? `${interaction.guild.channels.cache.get(schannel).toString()}`
            : "```Starboard Channel Not Set```"
        }`
      )
      .addField(
        "Starboard Stars",
        `${stars ? `\`\`\`${stars}\`\`\`` : "```3```"}`
      )
      .setTimestamp();

    return interaction.followUp({ embeds: [embed] });
  },
};
