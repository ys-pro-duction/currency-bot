const port = 3000
const express = require('express');
const app = express()
const axios = require('axios');
const {Telegraf} = require('telegraf');
const e = require("express");
require('dotenv').config()
const bot = new Telegraf(process.env.TELEGRAM_KEY);
async function getExchangeRates() {
    const apiKey = process.env.EXCHANGE_API_KEY;
    const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`;
    const response = await axios.get(url);
    return response.data.rates;
}
bot.command('convert', async (ctx) => {
    const [amount, fromCurrency, toCurrency] = ctx.message.text.split(' ').slice(1);
    try {
        const exchangeRates = await getExchangeRates();
        const result = parseFloat(amount) * exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        ctx.reply(`${amount} ${fromCurrency} is equal to ${result.toFixed(2)} ${toCurrency}`);
    } catch (error) {
        ctx.reply(`Error: ${error.message}`);
    }
});
bot.command('start', async (ctx) => {
    try {
        ctx.reply("Usage: /convert [amount] [currencyFrom] [currencyTo]\n" +
            "example: /convert 15 USD INR")
    }catch (e) {

    }
})

bot.telegram.setWebhook(`https://currency-bot-plum.vercel.app//bot`).then((data)=>{
    console.log(data)
}).catch((err)=>{
    console.log(err)
});

app.use(bot.webhookCallback('/bot'));

app.use(express.json())
app.listen(port, () => {
    console.log("server started at " + port)
})