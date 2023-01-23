const { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require("discord.js");

/**
 * Creates an embed with buttons to navigate through multiple pages.
 * @param {Interaction} interaction Interaction
 * @param {EmbedBuilder[]} pages The pages to navigate through. There must be at least 2 pages, built with the EmbedBuilder class and given in an array.
 * @param {ButtonBuilder[]} buttons The buttons to use. There must be either 2 or 4 buttons. (2 for previous and next, 4 for first, previous, next, and last). Buttons must be built with the ButtonBuilder class and given in an array.
 * @param {number} timeout The time the user has to press a button before the embed is deleted. Defaults to 60000 ms (1 minute). Must be a number greater than 0
 * @param {string} footer The footer to use. Defaults to "Page {current}/{total}". Must be a string. {current} and {total} will be replaced with the current page and the total number of pages.
 */
module.exports = async (interaction, pages, buttons, timeout = 60000, footer = 'Page {current}/{total}') => {

    if (!pages) throw new Error("No pages provided.");
    if (pages.length === 1) throw new Error("There is only one page.");

    if (isNaN(timeout)) throw new Error("Timeout is not a number.");
    if (timeout < 0) throw new Error("Timeout cannot be less than 0.");

    if (!interaction) throw new Error("No interaction provided.");

    if (typeof footer !== "string") throw new Error("Footer is not a string.");

    if (!buttons) throw new Error("No buttons provided.");
    if (buttons.length !== 4 && buttons.length !== 2) throw new Error("There must be either 2 or 4 buttons.");
    if (buttons.length === 4 && buttons[0].data.style === ButtonStyle.Link || buttons[1].data.style === ButtonStyle.Link || buttons[2].data.style === ButtonStyle.Link || buttons[3].data.style === ButtonStyle.Link) throw new Error("Buttons cannot be links.");
    if (buttons.length === 2 && buttons[0].data.style === ButtonStyle.Link || buttons[1].data.style === ButtonStyle.Link) throw new Error("Buttons cannot be links.");

    if (!interaction.deferred) await interaction.deferReply();

    let currentPage = 0;

    const initialButtons = [];

    // There's probably a better way to do this but my brain is fried.
    if (buttons.length === 4) {
        initialButtons.push(buttons[0].setDisabled(true));
        initialButtons.push(buttons[1].setDisabled(true));
        initialButtons.push(buttons[2].setDisabled(false));
        initialButtons.push(buttons[3].setDisabled(false));
    }

    if (buttons.length === 2) {
        initialButtons.push(buttons[0].setDisabled(true));
        initialButtons.push(buttons[1].setDisabled(false));
    }

    // Set the initial embed and buttons.
    const page = await interaction.editReply({
        embeds: [
            pages[0]
            .setFooter({text: footer.replace("{current}", currentPage + 1).replace("{total}", pages.length)})
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(initialButtons)
        ],
    });

    const collector = page.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: timeout,
    });

    collector.on("collect", async (i) => {

        const update = async () => {
            let buttonsArray = [];

            // If there are 4 buttons (first, previous, next, last)
            // Set the correct buttons to disabled if they are on the first or last page.
            if (buttons.length === 4) {
                if (currentPage === 0) {
                    buttonsArray.push(buttons[0].setDisabled(true));
                    buttonsArray.push(buttons[1].setDisabled(true));
                } else {
                    buttonsArray.push(buttons[0].setDisabled(false));
                    buttonsArray.push(buttons[1].setDisabled(false));
                }
                if (currentPage === pages.length - 1) {
                    buttonsArray.push(buttons[2].setDisabled(true));
                    buttonsArray.push(buttons[3].setDisabled(true));
                } else {
                    buttonsArray.push(buttons[2].setDisabled(false));
                    buttonsArray.push(buttons[3].setDisabled(false));
                }
            }

            // If there are 2 buttons (previous, next)
            // Set the correct buttons to disabled if they are on the first or last page.
            if (buttons.length === 2) {
                if (currentPage === 0) {
                    buttonsArray.push(buttons[0].setDisabled(true));
                } else {
                    buttonsArray.push(buttons[0].setDisabled(false));
                }
                if (currentPage === pages.length - 1) {
                    buttonsArray.push(buttons[1].setDisabled(true));
                } else {
                    buttonsArray.push(buttons[1].setDisabled(false));
                }
            }

            // Update the page to the new page
            await interaction.editReply({
                embeds: [
                    pages[currentPage]
                    .setFooter({text: footer.replace("{current}", currentPage + 1).replace("{total}", pages.length)})
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(buttonsArray)
                ],
            });
            await collector.resetTimer();
        };

        // First button. If there are 4 buttons, it will go to the first page. If there are 2 buttons, it will go to the previous page.
        if (i.customId == buttons[0].data.custom_id) {
            if (currentPage !== 0) {
                if (buttons.length === 4) currentPage = 0;
                if (buttons.length === 2) currentPage--; 
                await update();
            }
        // Second button. If there are 4 buttons, it will go to the previous page. If there are 2 buttons, it will go to the next page.
        } else if (i.customId == buttons[1].data.custom_id) {
            if (buttons.length === 4) {
                if (currentPage !== 0) {
                    currentPage--;
                    await update();
                }
            } else if (buttons.length === 2) {
                if (currentPage < pages.length - 1) {
                    currentPage++;
                    await update();
                }
            }
        // Third button. If there are 4 buttons, it will go to the next page. If there are 2 buttons, it will do nothing.
        } else if (buttons[2] && i.customId == buttons[2].data.custom_id) {
            if (currentPage < pages.length - 1) {
                currentPage++;
                await update();
            }
        // Fourth button. If there are 4 buttons, it will go to the last page. If there are 2 buttons, it will do nothing.
        } else if (buttons[3] && i.customId == buttons[3].data.custom_id) {
            if (currentPage !== pages.length - 1) {
                currentPage = pages.length - 1;
                await update();
            }
        }

    });

    // If the collector times out, disable all the buttons.
    collector.on("end", async () => {
        await interaction.editReply({
            components: [
                new ActionRowBuilder()
                    .addComponents(buttons.map(b => b.setDisabled(true)))
            ],
        });
    });

}