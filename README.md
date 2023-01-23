# discordjs-v14-pagination
Provides pagination for embeds in [discord.js v14](https://github.com/discordjs/discord.js/tree/main) using slash commands

## Table of Contents
- [1 Installation](#1-installation)
- [2 Requirements](#2-requirements)
- [3 Usage](#3-usage)
  - [3.1 Importing](#31-importing)
  - [3.2 Embeds](#32-embeds)
  - [3.3 Buttons](#33-buttons)
    - [3.3.1 Example using four buttons](#331-example-using-four-buttons)
    - [3.3.2 Example using two buttons](#332-example-using-two-buttons)
  - [3.4 Pagination Embed](#34-pagination-embed)
- [4 Screenshots](#4-screenshots)
    - [4.1 Four Buttons](#41-four-buttons)
    - [4.2 Two Buttons](#42-two-buttons)

## 1 Installation
```bash
npm install discordjs-v14-pagination
```

## 2 Requirements
- Discord.js version 14.7.1 or higher
- Node.js version 16.14.2 or higher

## 3 Usage
How to use this package
### 3.1 Importing
Import the package. You can pick any name you want for the import.
```js
const paginationEmbed = require('discordjs-v14-pagination');
```

### 3.2 Embeds
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

### 3.3 Buttons
Define an array of buttons. You can choose whether to use two or four buttons. 

If you use four buttons, the order is as follows: `[ FIRSTPAGE, PREVIOUS, NEXT, LASTPAGE ]`. 

If you use two buttons, the order is as follows: `[ PREVIOUS, NEXT ]`.

You can give the buttons any custom id you want.
> **Note:** The buttons will be disabled if there is no page to go to. For example, if you are on the first page, the first page and next page buttons will be disabled.

#### 3.3.1 Example using four buttons
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

#### 3.3.2 Example using two buttons
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

### 3.4 Pagination Embed
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

## 4 Screenshots
An example of how the pagination could look like.

> You can change the style of the embeds and buttons however you like

### 4.1 Four Buttons
![image](https://user-images.githubusercontent.com/123409977/214140917-013f38a3-a7bf-41df-b9b0-4f9b794b6f16.png)
### 4.2 Two Buttons
![image](https://user-images.githubusercontent.com/123409977/214140338-76f159cc-8a52-423a-98e1-fef660ccfcb7.png)

When on the first page, all the buttons that take you to a previous page will be disabled. When on the last page, all the buttons that take you to a next page will be disabled. When the timeout ends, all buttons will be disabled.
