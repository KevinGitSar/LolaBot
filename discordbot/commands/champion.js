//"StAuth10222: I Kevin Sar, 000390567 certify that this material is my original work.

const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

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
		.setName('champion')
		.setDescription('Returns the champion\'s details.')
        .addStringOption(option => 
            option.setName('championname')
                .setDescription('The champion\'s name.')
                .setRequired(true)),
	async execute(interaction) {
        //Get User input
        let championName = interaction.options.getString('championname');

        //Make Request to save champion dataset
        // Riot's League of Legends dataset on Champions
        const result = await axios.get(
            'http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json', {
            headers: headerParams
            }
        );

        //If Champion name is valid and found in dataset
        let championData = result.data.data[championName];
        if(typeof championData !== 'undefined'){
            let champName = championData['name'];
            let champTitle = championData['title'];
            let champBlurb = championData['blurb'];
            let champImage = championData['image']['full'];
            let champTags = championData['tags']; //an array
            
            //Return champion details + image
            interaction.channel.send({files: ['https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/' + champImage]});
            
            setTimeout(function(){
                interaction.channel.send(`\n\n"${champBlurb}"`);
            }, 1000);
            
            return interaction.reply(`${champName}: ${champTitle}\nType: ${champTags}`);
            
        } else{
            return interaction.reply("Invalid Champion Name!");
        }

    },
};
