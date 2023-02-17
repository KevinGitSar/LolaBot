//"StAuth10222: I Kevin Sar, 000390567 certify that this material is my original work. 
//No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."

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
		.setName('winratio')
		.setDescription('Checks a certain amount of games and calculate the ratio.')
        .addStringOption(option => 
            option.setName('summonername')
                .setDescription('The summoner\'s in game name.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('numberofgames')
                .setDescription('Amount of games you want to check (min: 1 max: 20).')
                .setRequired(true)),
	async execute(interaction) {

        //Get users input
        let summonerName = interaction.options.getString('summonername');
        let numberOfGames = interaction.options.getInteger('numberofgames');
        let summonerPUUID;
        let numberOfWins = 0;
        
        //Make Request to api to get user account information to make other requests later
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

        //Checks if users request is within range, api does not accept anything less than 1 or more than 20
        if(numberOfGames >= 1 && numberOfGames <=20){
            if(summonerPUUID != "" || summonerPUUID != null){
                const response = await axios.get(
                    "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + summonerPUUID + "/ids?start=0&count=" + numberOfGames, {
                    headers: headerParams
                    }
                );

                //Response may take awhile to fetch data, therefore deferReply() is necessary
                let listOfGames = response.data;
                await interaction.deferReply();

                //Make Request to find all matches depending on user's request
                let response2;
                for(let i = 0; i < listOfGames.length; i ++){
                    response2 = await axios.get(
                        "https://americas.api.riotgames.com/lol/match/v5/matches/" + listOfGames[i], {
                        headers: headerParams
                        }
                    );
                    let gamesData = response2.data['info']['participants'];
                    
                    //For each match, find data that corresponds to user's account details
                    for(let indexGamesData = 0; indexGamesData < gamesData.length; indexGamesData++){
                        if(gamesData[indexGamesData]["puuid"] == summonerPUUID && gamesData[indexGamesData]["win"] == true){
                            numberOfWins++;
                        }
                    }
                }
                //Return response with data
                let winratio = Math.round((numberOfWins/numberOfGames) * 100);
                return interaction.editReply(`${summonerName}'s at ${winratio}% winrate!\nWith ${numberOfWins} wins in the last ${numberOfGames} Games`);
            }
        } else{
            return interaction.reply("Number of games not within range.")
        }
    },
};
