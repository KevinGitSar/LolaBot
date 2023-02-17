//"StAuth10222: I Kevin Sar, 000390567 certify that this material is my original work. 

const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

//Locate API in env file in root directory
require('dotenv').config();

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
		.setName('mastery')
		.setDescription('Returns the total mastery and mastery of current champion.')
        .addStringOption(option => 
            option.setName('summonername')
                .setDescription('The summoner\'s in game name.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('championname')
                .setDescription('The champion\'s name.')
                .setRequired(true)),
	async execute(interaction) {

        // Get Users input and store in a variable
        let summonerName = interaction.options.getString('summonername');
        let championName = interaction.options.getString('championname');
        
        // Riot's League of Legends dataset on Champions
        const result = await axios.get(
            'http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json', {
            headers: headerParams
            }
        );

        //Make request to find user's account information to make other requests later with that account
        let result2;
        let summonerID;
        try {
            result2 = await axios.get(
                'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName, {
                headers: headerParams
                }
            );
            summonerID = result2.data["id"];
            summonerName = result2.data["name"];
        } catch (error) {
            return interaction.reply("Summoner Name Invalid.");
        }

        //Make request using Champion name that user input to get champion's id/key (input is sensitive)
        let championKey;
        try {
            championKey = JSON.stringify(result.data.data[championName]["key"]);   
        } catch (error) {
            return interaction.reply("Invalid Parameters: Check Summoner Name or Champion Name and Try again?");
        }

        //Make request with user account and champion id to get user's champion mastery
        if(championKey != "" || championKey != null && summonerID != "" || summonerID != null){
            championKey = championKey.slice(1,-1);

            const response = await axios.get(
                'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + summonerID + '/by-champion/' + championKey, {
                headers: headerParams
                }
            );

            //Return data response
            let data = response.data;
            const masteryLevel = data['championLevel'];
            const masteryPoints = data['championPoints'];
            
            return interaction.reply(`${summonerName}'s ${championName} Mastery Stats\nMastery Level:   ${masteryLevel}\nMastery Points: ${masteryPoints}`);
        } else {
            return interaction.reply("Invalid Parameters, try again?");
        }
    },
};
