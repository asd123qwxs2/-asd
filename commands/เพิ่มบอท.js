const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

// เก็บโทเค่นของบอทที่เพิ่ม
let botList = [];

module.exports = {
    name: 'เพิ่มบอท',
    async execute(message) {
        // ตรวจสอบจำนวนบอทที่สามารถเพิ่มได้
        if (botList.length >= 5) {
            return message.reply('คุณสามารถเพิ่มบอทได้สูงสุด 5 ตัวเท่านั้น');
        }

        // สร้างปุ่มสำหรับเพิ่มบอท
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('addBot')
                .setLabel('เพิ่มบอทใหม่')
                .setStyle(ButtonStyle.Primary)
        );

        // ส่งข้อความให้ผู้ใช้กดปุ่ม
        await message.reply({
            content: 'คลิกปุ่มเพื่อเพิ่มบอทใหม่',
            components: [row],
        });
    },

    // การจัดการปุ่มกดเมื่อผู้ใช้คลิก
    async handleInteraction(interaction) {
        if (interaction.isButton() && interaction.customId === 'addBot') {
            // เมื่อกดปุ่มเพิ่มบอทใหม่ ให้ขอกรอกโทเค่น
            const modal = new ModalBuilder()
                .setCustomId('token-modal')
                .setTitle('กรอกโทเค่นของบอทใหม่');
            
            // สร้างฟอร์มกรอกโทเค่น
            const tokenInput = new TextInputBuilder()
                .setCustomId('new-token')
                .setLabel('กรุณากรอกโทเค่นของบอทที่ต้องการเพิ่ม')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // กำหนดให้ต้องกรอกโทเค่น

            const actionRow = new ActionRowBuilder().addComponents(tokenInput);
            modal.addComponents(actionRow);

            // แสดง Modal ให้ผู้ใช้กรอก
            await interaction.showModal(modal);
        }
    },

    // ฟังก์ชันสำหรับรับข้อมูลจาก Modal
    async addBotToken(interaction) {
        if (interaction.customId === 'token-modal') {
            const newToken = interaction.fields.getTextInputValue('new-token');

            // ตรวจสอบว่าโทเค่นมีหรือไม่
            if (!newToken) {
                return interaction.reply({ content: '❌ กรุณากรอกโทเค่นของบอท', ephemeral: true });
            }

            // เพิ่มโทเค่นเข้าไปใน list
            if (botList.length < 5) {
                botList.push(newToken);
                interaction.reply({ content: `✅ บอทใหม่ได้ถูกเพิ่มเรียบร้อยแล้ว! โทเค่น: ${newToken}`, ephemeral: true });
            } else {
                interaction.reply({ content: '❌ คุณไม่สามารถเพิ่มบอทได้อีกแล้ว (จำกัด 5 ตัว)', ephemeral: true });
            }
        }
    },
};
