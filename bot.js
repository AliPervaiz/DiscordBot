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
var userInfo = [];
function printArticleByID(id, channelID)
{
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        var obj = JSON.parse(this.responseText);
        bot.sendMessage({to: channelID,message: obj.sections[0].content[0].text});
      }
    });
    xhr.open("GET", "http://fortnite.wikia.com/api/v1/Articles/AsSimpleJson?id="+id);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "9873eadc-343d-4db7-84cd-bee49bbbdd78");
    xhr.send(data); 
}
function compare(player1, stats, player2, channelID)
{
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        var obj = JSON.parse(this.responseText);
        var response = "";
        var matchsPlayed = parseInt(obj.lifeTimeStats[7].value);
        console.log(stats[1] + " " + matchsPlayed);
        if(stats[1]>matchsPlayed)
            response += player1 + " has played more games than " + player2 + " (" + stats[1] + " vs " + matchsPlayed + ")\n";
        else
            response += player2 + " has played more games than " + player1 + " (" + matchsPlayed + " vs " + stats[1] + ")\n";
        var wins = parseInt(obj.lifeTimeStats[8].value);
        if(stats[2]>wins)
            response += player1 + " has more wins than " + player2 + " (" + stats[2] + " vs " + wins + ")\n";
        else
            response += player2 + " has more wins than " + player1 + " (" + wins + " vs " + stats[2] + ")\n";
        var kills = parseInt(obj.lifeTimeStats[10].value);
        if(stats[3]>kills)
            response += player1 + " has more kills than " + player2 + " (" + stats[3] + " vs " + kills + ")\n";
        else
            response += player2 + " has more kills than " + player1 + " (" + kills + " vs " + stats[3] + ")\n";
        var kd = parseInt(obj.lifeTimeStats[11].value);
        if(stats[4]>kd)
            response += player1 + " has a better kd than " + player2 + " (" + stats[4] + " vs " + kd + ")\n";
        else
            response += player2 + " has a better kd than " + player1 + " (" + kd + " vs " + stats[4] + ")\n";
        bot.sendMessage({to: channelID,message: response});
      }
    });
    xhr.open("GET", "https://api.fortnitetracker.com/v1/profile/pc/"+player2);
    xhr.setRequestHeader("TRN-Api-Key", "59090867-5814-4625-9e58-cfc0ef743422");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "49b87329-a8b8-409a-b6c3-c7146f2aadc6");
    xhr.send(data);
}
var duo = [];
var squad = [];
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
    if(message.substring(0,6)=="!stats")
    {
        var name = message.substring(7);
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            var bestTRN = obj.stats.p9.trnRating.displayValue;
            var rank = obj.stats.p9.trnRating.rank;
            var percentile = obj.stats.p9.trnRating.percentile;
            var matchsPlayed = obj.lifeTimeStats[7].value;
            var wins = obj.lifeTimeStats[8].value;
            var winPercentile = obj.lifeTimeStats[9].value;
            var kills = obj.lifeTimeStats[10].value;
            var kd = obj.lifeTimeStats[11].value;
            var response = bestTRN + " " + rank + " " + percentile + " " + matchsPlayed + " " + wins + " " + winPercentile + " " + kills + " " + kd;
            bot.sendMessage({to: channelID,message: response});
          }
        });
        xhr.open("GET", "https://api.fortnitetracker.com/v1/profile/pc/"+name);
        xhr.setRequestHeader("TRN-Api-Key", "59090867-5814-4625-9e58-cfc0ef743422");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "49b87329-a8b8-409a-b6c3-c7146f2aadc6");
        xhr.send(data);
    }
    if(message == "!challenges")
    {
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            var response = "";
            for(var c = 0; c < 7; c++)
            {
                var name = obj.items[c].metadata[1].value;
                var times = obj.items[c].metadata[3].value;
                var xp = obj.items[c].metadata[5].value;
                response += name + " (" + times + ") for " + xp + " XP\n";  
            }
            bot.sendMessage({to: channelID,message: response});
          }
        });
        xhr.open("GET", "https://api.fortnitetracker.com/v1/challenges");
        xhr.setRequestHeader("TRN-Api-Key", "59090867-5814-4625-9e58-cfc0ef743422");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "0fdfbe6d-8005-4188-96c4-bb7568d80067");
        xhr.send(data);
    }
    if(message == "!store")
    {
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.length; i++)
            {
                var response = obj[i].name + " ("+obj[i].vBucks+" vBucks)\n"+obj[i].imageUrl+"\n";
                bot.sendMessage({to: channelID,message: response});
            }
            
          }
        });
        xhr.open("GET", "https://api.fortnitetracker.com/v1/store");
        xhr.setRequestHeader("TRN-Api-Key", "59090867-5814-4625-9e58-cfc0ef743422");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "fd523b99-9b42-4f2a-b2b0-63e284335678");
        xhr.send(data);
    }
    if(message == "!whereWeLandingBoys")
    {
        var places = ["Haunted Hills", "Junk Junction", "Loot Lake", "Pleasant Park", "Snobby Shores", "Tilted Towers", "Flush Factory", "Greasy Grove", "Lucky Landing", "Shifty Shafts", "Fatal Fields", "Paradise Palms", "Retail Row", "Salty Springs", "Dusty Divot", "Lazy Links", "Lonely Lodge", "Risky Reels", "Tomato Temple", "Wailing Woods"];
        bot.sendMessage({to: channelID,message: "Yall landing at " + places[parseInt(Math.random()*places.length)]});
    }
    if(message.substring(0,7) == "!notify")
    {
        var item = message.substring(8);
        var data = null;
        var found = false;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.length; i++)
            {
                if(item==obj[i].name)
                {
                    found = true;
                    bot.sendMessage({to: channelID,message: item + " is already in the store!"});
                }
            }
            if(!found)
            {
                bot.sendMessage({to: channelID,message: "Alright, we'll notify you when " + item + " is in the store again!"});
            }
          }
        });
        xhr.open("GET", "https://api.fortnitetracker.com/v1/store");
        xhr.setRequestHeader("TRN-Api-Key", "59090867-5814-4625-9e58-cfc0ef743422");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "fd523b99-9b42-4f2a-b2b0-63e284335678");
        xhr.send(data);
    }
    if(message.substring(0,7) == "!search")
    {
        var topic = message.substring(8).toLowerCase();
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.items.length; i++)
            {
                if(obj.items[i].title.toLowerCase()==topic)
                {
                    var id = obj.items[i].id;
                    printArticleByID(id,channelID);
                }
            }
          }
        });

        xhr.open("GET", "http://fortnite.wikia.com/api/v1/Articles/List?limit=10000");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "54384205-e614-497c-b8d0-def79893437a");

        xhr.send(data);
    }
    if(message.substring(0,7) == "!weapon")
    {
        var name = message.substring(8).toLowerCase();
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            var response = "";
            for(var i = 0; i < obj.length; i++)
            {
                if(obj[i].name.toLowerCase()==name)
                {
                    response += obj[i].rarity.substring(0,1).toUpperCase() + "" + obj[i].rarity.substring(1) + " " + obj[i].name + "\n";
                    response += "Type: " + obj[i].type + "\n";
                    response += "Damage per Second: " + obj[i].dps + "\n";
                    response += "Damage: " + obj[i].damage + "\n";
                    response += "Headshot damage: " + obj[i].headshotdamage + "\n";
                    response += "Fire rate: " + obj[i].firerate + "\n";
                    response += "Magazine size: " + obj[i].magsize + "\n";
                    response += "Reload time: " + obj[i].reloadtime + "\n\n";
                }
            }
            bot.sendMessage({to: channelID,message: response});
          }
        });

        xhr.open("GET", "http://www.fortnitechests.info/api/weapons");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "68fe1573-6509-45ab-9daf-563c4a7f17c5");

        xhr.send(data);    
    }
    if(message == "!duoup")
    {
        console.log(userID);
        if(duo.length==0)
        {
            duo.push(user);
            bot.sendMessage({to: channelID,message: "Alright "+user+" we'll notify you when a duo is found!"});
        }
        else
        {
            bot.sendMessage({to: channelID,message: duo[0] + " and " + user + " have been paired!"});
            duo = [];
        }
    }
    if(message == "!dailygoal")
    {
        console.log("welp");
    }
    if(message.substring(0,8) == "!compare")
    {
        var ar = message.split(" ");
        var data = null;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            var stats = [];
            stats.push(0);
            stats.push(parseInt(obj.lifeTimeStats[7].value));
            stats.push(parseInt(obj.lifeTimeStats[8].value));
            stats.push(parseInt(obj.lifeTimeStats[10].value));
            stats.push(parseInt(obj.lifeTimeStats[11].value));
            compare(ar[1],stats,ar[2],channelID);
          }
        });
        xhr.open("GET", "https://api.fortnitetracker.com/v1/profile/pc/"+ar[1]);
        xhr.setRequestHeader("TRN-Api-Key", "59090867-5814-4625-9e58-cfc0ef743422");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "49b87329-a8b8-409a-b6c3-c7146f2aadc6");
        xhr.send(data);
    }
    if(message.substring(0,8) == "!connect")
    {
        var username = message.substring(9);
        userInfo[user] = username;
        console.log(userInfo);
    }
}); 