# discordjs-pagination
Provides pagination for embeds in [discord.js v14](https://github.com/discordjs/discord.js/tree/main) using slash commands

## Table of Contents
- [Installation](#installation)
- [Requirements](#requirements)
- [Usage](#usage)
    - [Importing](#importing)
    - [Embeds](#embeds)
    - [Buttons](#buttons)
        - [Example using four buttons](#example-using-four-buttons)
        - [Example using two buttons](#example-using-two-buttons)
    - [Pagination Embed](#pagination-embed)
- [Screenshots](#screenshots)

## Installation
```bash
npm install discordjs-pagination
```

## Requirements
- Discord.js version 14.7.1 or higher
- Node.js version 16.14.2 or higher

## Usage
### Importing
Import the package. You can pick any name you want for the import.
```js
const paginationEmbed = require('discordjs-pagination');
```

### Embeds
Define an array of embeds. The embeds can look however you want, but the footer will be overwritten by the pagination embed.
```js
const pageOne = new EmbedBuilder()
    .setTitle('Page One')
    .setDescription('This is page one');

const pageTwo = new EmbedBuilder()
    .setTitle('Page Two')
    .setDescription('This is page two');

const pageThree = new EmbedBuilder()
    .setTitle('Page Three')
    .setDescription('This is page three');

const embeds = [ pageOne, pageTwo, pageThree ];
```

### Buttons
Define an array of buttons. You can choose whether to use two or four buttons. 
If you use four buttons, the order is as follows: `[ FIRSTPAGE, PREVIOUS, NEXT, LASTPAGE ]`. 
If you use two buttons, the order is as follows: `[ PREVIOUS, NEXT ]`.

You can give the buttons any custom id you want.
> **Note:** The buttons will be disabled if there is no page to go to. For example, if you are on the first page, the first page and next page buttons will be disabled.

#### Example using four buttons
```js
const firstPageButton = new ButtonBuilder()
    .setCustomId('first')
    .setEmoji('1029435230668476476')
    .setStyle(ButtonStyle.Primary);

const previousPageButton = new ButtonBuilder()
    .setCustomId('previous')
    .setEmoji('1029435199462834207')
    .setStyle(ButtonStyle.Primary);

const nextPageButton = new ButtonBuilder()
    .setCustomId('next')
    .setEmoji('1029435213157240892')
    .setStyle(ButtonStyle.Primary);

const lastPageButton = new ButtonBuilder()
    .setCustomId('last')
    .setEmoji('1029435238948032582')
    .setStyle(ButtonStyle.Primary);

const buttons = [ firstPageButton, previousPageButton, nextPageButton, lastPageButton ];
```

#### Example using two buttons
```js
const previousPageButton = new ButtonBuilder()
    .setCustomId('previous')
    .setEmoji('1029435199462834207')
    .setStyle(ButtonStyle.Primary);

const nextPageButton = new ButtonBuilder()
    .setCustomId('next')
    .setEmoji('1029435213157240892')
    .setStyle(ButtonStyle.Primary);

const buttons = [ previousPageButton, nextPageButton ];
```

#### Pagination Embed
Create the pagination embed.
> When providing the text for the footer, you can use `{current}` and `{total}` as placeholders for the current page and the total number of pages.
```js
paginationEmbed(
    interaction, // The interaction object
    embeds, // Your array of embeds
    buttons, // Your array of buttons
    60000, // (Optional) The timeout for the embed in ms, defaults to 60000 (1 minute)
    'Page {current}/{total}' // (Optional) The text to display in the footer, defaults to 'Page {current}/{total}'
);
```

## Screenshots
An example of how the pagination could look like.

> You can change the style of the embeds and buttons however you like

### Four Buttons
![image](https://user-images.githubusercontent.com/123409977/214140917-013f38a3-a7bf-41df-b9b0-4f9b794b6f16.png)
### Two Buttons
![image](https://user-images.githubusercontent.com/123409977/214140338-76f159cc-8a52-423a-98e1-fef660ccfcb7.png)

When on the first page, all the buttons that take you to a previous page will be disabled. When on the last page, all the buttons that take you to a next page will be disabled. When the timeout ends, all buttons will be disabled.
