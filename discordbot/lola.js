// Same for any bots unless you watch more functionality
const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
    intents: [ GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent ]
});


// Turns on bot and logs them in
client.on("ready", ()=> {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message)=>{
    if(!message.author.bot){
        await message.channel.send("How you doin?");
    }
});

// Add Token to login
client.login("MTAyODAxNzcxNjk3MzU1MTc2Nw.Gk1A1L.lfalDV6e4XPNQz3ZYDP0vXTQ5wc47Pg6P6VKN8");