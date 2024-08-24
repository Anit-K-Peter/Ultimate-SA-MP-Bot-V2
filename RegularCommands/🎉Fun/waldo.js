const Discord = require("discord.js");

const waldos = [
  "https://www.9gag.com/",
  "https://www.imgur.com/",
  "https://www.reddit.com/r/funny/",
  "https://www.buzzfeed.com/",
  "https://www.theonion.com/",
  "https://www.clickhole.com/",
  "https://www.collegehumor.com/",
  "https://www.distractify.com/",
  "https://www.ebaumsworld.com/",
  "https://www.funnyordie.com/",
  "https://www.huffpost.com/entertainment",
  "https://www.ign.com/",
  "https://www.kotaku.com/",
  "https://www.memegen.com/",
  "https://www.nbc.com/",
  "https://www.popsugar.com/",
  "https://www.refinery29.com/",
  "https://www.rollingstone.com/",
  "https://www.spin.com/",
  "https://www.sportsillustrated.com/",
  "https://www.stereogum.com/",
  "https://www.theverge.com/",
  "https://www.vh1.com/",
  "https://www.vogue.com/",
  "https://www.wired.com/",
  "https://www.xkcd.com/",
  "https://www.yahoo.com/",
  "https://www.yelp.com/",
  "https://www.youtube.com/",
  "https://www.zdnet.com/",
  "https://www.zerohedge.com/",
  "https://www.zimbio.com/",
  "https://www.1up.com/",
  "https://www.22words.com/",
  "https://www.2dopeboyz.com/",
  "https://www.4chan.org/",
  "https://www.5gum.com/",
  "https://www.9to5mac.com/",
  "https://www.abduzeedo.com/",
  "https://www.achievementhunter.com/",
  "https://www.actiontrip.com/",
  "https://www.addictinggames.com/",
  "https://www.adultswim.com/",
  "https://www.afterellen.com/",
  "https://www.afterelton.com/",
  "https://www.allhiphop.com/",
  "https://www.allmusic.com/",
  "https://www.allrecipes.com/",
  "https://www.alternet.org/",
  "https://www.anandtech.com/",
  "https://www.andpop.com/",
  "https://www.animalshelter.org/",
  "https://www.animefreak.tv/",
  "https://www.animenation.com/",
  "https://www.animenewsnetwork.com/",
  "https://www.animeseason.com/",
  "https://www.aoltv.com/",
  "https://www.apple.com/",
  "https://www.appleinsider.com/",
  "https://www.appscout.com/",
  "https://www.arcadefire.net/",
  "https://www.archdaily.com/",
  "https://www.ariannahuffington.com/",
  "https://www.arstechnica.com/",
  "https://www.artofmanliness.com/",
  "https://www.askmen.com/",
  "https://www.asylum.com/",
  "https://www.atlantamagazine.com/",
  "https://www.auctionzip.com/",
  "https://www.audiojungle.net/",
  "https://www.audiomicro.com/",
  "https://www.audiotool.com/",
  "https://www.autoblog.com/",
  "https://www.autodesk.com/",
  "https://www.autotrader.com/",
  "https://www.avclub.com/",
  "https://www.avaxhome.ws/",
  "https://www.newgrounds.com/",
  "https://www.omgubuntu.co.uk/",
  "https://www.polygon.com/",
  "https://www.roosterteeth.com/",
  "https://www.smosh.com/",
  "https://www.uproxx.com/",
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  name: "waldo",
  description: "Try to find Waldo with spoiler tags!",
  aliases: [
    "wheres-waldo",
    "where's-waldo",
    "wally",
    "wheres-wally",
    "where's-wally",
  ],
  execute(message) {
    try {
      const where = shuffle(waldos)[0];
      message.channel.send(`||${where}||`);
    } catch (error) {
      console.error(error);
      message.channel.send("Error: Unable to find Waldo");
    }
  },
};
