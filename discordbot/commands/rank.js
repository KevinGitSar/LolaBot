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
		.setName('rank')
		.setDescription('Returns Rank Stats for Solo/Duo or Flex Queue.')
        .addStringOption(option => 
            option.setName("summonername")
                .setDescription("The summoner's in game name")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("ranktype")
                .setDescription("The type of rank")
                .setRequired(true)),
	async execute(interaction) {

        //Get user's input
        let rankType = interaction.options.getString("ranktype");
        let summonerName = interaction.options.getString("summonername");

        let summonerID = "";

        //Get user's account details
        try { 
            const result = await axios.get('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName, {
                headers: headerParams
            });   

            summonerID = result.data["id"];
            summonerName = result.data["name"];
        } catch (error) {
            return interaction.reply("Invalid Summoner Name");
        }

        let rankData;
        //Get user's rank data
        if(summonerID != ""){
            rankData = await axios.get('https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerID, {
                headers: headerParams
            });
        }

        //Check is user wants solo or flex stats
        rankType = rankType.toLowerCase();

        //Check if user has any rank stats at all
        if(rankType == "flex" && rankData.data.length > 0){
            //If they have rank stats return data
            if(rankData.data[0].queueType == "RANKED_FLEX_SR"){
                const flexStats = rankData.data[0]
                const tier = flexStats.tier;
                const rank = flexStats.rank;
                const leaguePoints = flexStats.leaguePoints;
                const totalWins = flexStats.wins;
                const totalLosses = flexStats.losses;
                return await interaction.reply(
                    `${summonerName} RANK FLEX STATS\n${tier}\t${rank}\t${leaguePoints}LP\nTOTAL WIN/LOSS: ${totalWins}/${totalLosses}\n`);
            } //If they have more than 1 rank stats check if flex stats is in array[1]
            else if(rankData.data.length > 1 && rankData.data[1].queueType == "RANKED_FLEX_SR"){
                const flexStats = rankData.data[1]
                const tier = flexStats.tier;
                const rank = flexStats.rank;
                const leaguePoints = flexStats.leaguePoints;
                const totalWins = flexStats.wins;
                const totalLosses = flexStats.losses;
                return await interaction.reply(
                    `${summonerName} RANK FLEX STATS\n${tier}\t${rank}\t${leaguePoints}LP\nTOTAL WIN/LOSS: ${totalWins}/${totalLosses}\n`);
            }  //If they do not have flex stats
            else{
                return await interaction.reply(`${summonerName} has no rank flex stats! (Unranked in flex?).`)
            }

        } //Check if they have any rank stats
        else if(rankType == "solo" && rankData.data.length > 0){
            //If they have solo stats
            if(rankData.data[0].queueType == "RANKED_SOLO_5x5"){
                const soloStats = rankData.data[0]
                const tier = soloStats.tier;
                const rank = soloStats.rank;
                const leaguePoints = soloStats.leaguePoints;
                const totalWins = soloStats.wins;
                const totalLosses = soloStats.losses;
                return await interaction.reply(
                    `${summonerName} RANK SOLO STATS\n${tier}\t${rank}\t${leaguePoints}LP\nTOTAL WIN/LOSS: ${totalWins}/${totalLosses}\n`);
            } //If they have more than 1 rank stats check if solo stats is in array[1]
            else if(rankData.data.length > 1 && rankData.data[1].queueType == "RANKED_SOLO_5x5"){
                const soloStats = rankData.data[1]
                const tier = soloStats.tier;
                const rank = soloStats.rank;
                const leaguePoints = soloStats.leaguePoints;
                const totalWins = soloStats.wins;
                const totalLosses = soloStats.losses;
                return await interaction.reply(
                    `${summonerName} RANK SOLO STATS\n${tier}\t${rank}\t${leaguePoints}LP\nTOTAL WIN/LOSS: ${totalWins}/${totalLosses}\n`);
            } //If they have no solo stats
            else{
                return await interaction.reply(`${summonerName} has no rank solo stats! (Unranked in solo/duo?).`)
            }
            //If they have no rank stats at all
        } else{
            return interaction.reply("No Rank Stats (Unranked?).");
        }
	},
};
