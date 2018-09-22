var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if(message=="!help"||message=="!")
    {
        bot.sendMessage({to: channelID,message: "Hello, Im Fornite Pro! Here's a list of commands. \n !tip"});
    }
    if(message=="!tip")
    {
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            var category = parseInt(Math.random()*9)+1;
            var tip = parseInt(Math.random()*obj.sections[category].content[0].elements.length);
            bot.sendMessage({to: channelID,message: obj.sections[category].content[0].elements[tip].text});
          }
        });

        xhr.open("GET", "http://fortnite.wikia.com/api/v1/Articles/AsSimpleJson?id=4609");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "9873eadc-343d-4db7-84cd-bee49bbbdd78");
        xhr.send(data);
    }
}); 