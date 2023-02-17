//"StAuth10222: I Kevin Sar, 000390567 certify that this material is my original work. 

/** This Command is currently broken due to changes in Riot's League of Legends API */

const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

//Locate API in env file in root directory
require('dotenv').config();

console.log(process.env.RIOT_API_KEY);
//Header Parameters to make requests to Riot's API
//X-Riot-Token Expires after 24 Hours must be reset before use!
const headerParams = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Accept-Language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com",
    "X-Riot-Token": process.env.RIOT_API_KEY
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lastgame')
		.setDescription('Shows the user\'s last game stats.')
        .addStringOption(option => 
            option.setName('summonername')
                .setDescription('The summoner\'s in game name.')
                .setRequired(true)),
	async execute(interaction) {

        //Get user's input
        let summonerName = interaction.options.getString('summonername');
        let summonerPUUID;
        
        //Make Request to find user's account details for more request to api later
        try {
            result = await axios.get(
                'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName, {
                headers: headerParams
                }
            );
            summonerPUUID = result.data["puuid"];
            summonerName = result.data["name"];
        } catch (error) {
            return interaction.reply("Summoner Name Invalid.");
        }

        //Make request to find user's last game
        if(summonerPUUID != "" || summonerPUUID != null){
            const response = await axios.get(
                    "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + summonerPUUID + "/ids?start=0&count=1", {
                    headers: headerParams
                }
            );

            let matchID = response.data;

            //Find user's last game data
            let response2;
            response2 = await axios.get(
                "https://americas.api.riotgames.com/lol/match/v5/matches/" + matchID[0], {
                headers: headerParams
                }
            );
            let gameData = response2.data['info']['participants'];
            let gameStats;

            for(let indexGamesData = 0; indexGamesData < gameData.length; indexGamesData++){
                if(gameData[indexGamesData]["puuid"] == summonerPUUID){
                    gameStats = gameData[indexGamesData];
                }
            }

            //Save user's last game data in variables
            let win = gameStats['win'];
            if(win == true){
                win ="Game Won!"
            } else{
                win = "Game Lost!"
            }
            let champName = gameStats['championName'];
            let championLevel = gameStats['champLevel'];
            let assists = gameStats['assists'];
            let deaths = gameStats['deaths'];
            let kills = gameStats['kills'];
            let totalMinionsKilled = gameStats['totalMinionsKilled'];
            let goldEarned = gameStats['goldEarned'];
            let role = gameStats['individualPosition'];
            let totalDmgDealt = gameStats['totalDamageDealtToChampions'];
            let physicalDmgDealt = gameStats['physicalDamageDealtToChampions'];
            let magicDmgDealt = gameStats['magicDamageDealtToChampions'];
            let trueDmgDealt = gameStats['trueDamageDealtToChampions'];
            //in ['challenges']
            //let abilitiesUsed = gameStats['challenges']['abilityUses'];
            let damagePerMinute = Math.round(gameStats['challenges']['damagePerMinute']);
            let goldPerMinute = Math.round(gameStats['challenges']['goldPerMinute']);
            let kda = gameStats['challenges']['kda'];
            let gameLength = Math.round(gameStats['challenges']['gameLength']/60);
            let stealthWardsPlaced = gameStats['challenges']['stealthWardsPlaced'];
            let controlWardsPlaced = gameStats['challenges']['controlWardsPlaced'];
            
            // AFTER CONTROL WARDS /**\nHow Many Times Abilities Used: ${abilitiesUsed}*/
            //Show user their last game stats
            interaction.reply(`LAST GAME STATS FOR ${summonerName}\nChampion Played: ${champName}\tLevel: ${championLevel}\tRole: ${role}\nKills: ${kills}\tDeaths: ${deaths}\tAssists: ${assists}\tKDA Score: ${kda}\nTotal Minions Killed: ${totalMinionsKilled}\tTotal Gold Earned: ${goldEarned}\tGoldPerMinute: ${goldPerMinute}\nStealth Wards Placed: ${stealthWardsPlaced}\tControl Wards Placed: ${controlWardsPlaced}\nPhysical Damage Dealt: ${physicalDmgDealt}\tMagic Damage Dealt: ${magicDmgDealt}\nTrue Damage Dealt: ${trueDmgDealt}\tTotal Damage Dealt: ${totalDmgDealt}\tDamagePerMinute: ${damagePerMinute}\nGame Length: ${gameLength} minutes\tGame Result: ${win}`);
        }
    },
};
