# LolaBot
 League of Legends Application (Lola) Discord Bot

# Commands
 /rank sumonerName solo/flex
  - Shows details of a user's solo or flex stats
  
 /mastery summonerName championName
  - Shows the user's champion mastery
  
 /champion championName
  - Shows small detail and lore about the champion
  - Champion name is extremely case/space sensitive (ex: MasterYi)
  
 /winratio summonerName numberOfGames
  - Calculates the user's winratio based on their last # of games
  
 /lastgame summonerName
  - Shows stats of the user's last game
  - Command currently does not work due to Riot Api's changes
  
  
# Install
### npm install packages
```
npm install
```
### Insert
 - cliendId, guildId, and token in config.json file
 - token in lola.js file
 - Riot Api Key from https://developer.riotgames.com/ in .env file

### running LolaBot locally

Create/Update LolaBot's command inputs
```
node deploy-commands.js
```

Turn on LolaBot
```
node lola.js
```

Turn on commands in discord server
```
node index.js
```

# Learn more
[Discord](https://discord.com/developers/docs/intro)'s Documentation.
