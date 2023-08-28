// require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = "6472114643:AAEWdMXrrpsMQCdvmHHv0Xl40aISA42Kr-U"
// const path = require('path')
// const sqlite3 = require('sqlite3').verbose()

// const dbpath = path.resolve(__dirname, '../model/data.db')

// const db = new sqlite3.Database(dbpath)
const web_link = "https://openbudget.uz/boards/initiatives/initiative/31/7c153bde-5d4a-46cf-a0eb-969e18641055";

// db.serialize(() => {
//     db.run("CREATE TABLE users(id INTEGER PRIMARY KEY, chat_id INTEGER NOT NULL, phone TEXT, created_at TEXT)");
// });

// db.close();

const bot = new TelegramBot(token, {
    polling: true
})


bot.on("polling_error", (msg) => console.log(msg))

let chatStep = []

bot.on('callback_query', query => {
    const chatId = query.message.chat.id
    const messageId = query.message.message_id
    const data = query.data
    const user = chatStep.find(item => item.chatId === chatId)

    if (data === 'complete') {
        bot.sendMessage(chatId, `Raqamingizni tekshirishga yuborildi.
        \nAgar to'g'ri kiritgan bo'lsangiz 24 soat ichida sizga xabar keladi, ungacha yangi raqam yuborishingiz mumkin.
        `, {
            reply_markup: {
                keyboard: [
                    [`🗳 Ovoz berish`],
                ],
                resize_keyboard: true,
            }
        })
        // bot.sendMessage(-1001683772356, `Yangi ovoz✅ ${user.phone} ${time}\n\nTekshirish`, {
        //     parse_mode: 'HTML',
        //     reply_markup: {
        //         inline_keyboard: [
        //             [
        //                 {
        //                     text: '✅',
        //                     callback_data: 'ok'
        //                 },
        //                 {
        //                     text: '❌',
        //                     callback_data: 'fake'
        //                 }
        //             ]
        //         ]
        //     }
        // })
        bot.deleteMessage(chatId, messageId)
        // db.run(`INSERT INTO users (chat_id, phone, created_at) VALUES (?, ?, datetime('now'))`, chatId, user.phone)
        user.step = 0
    }
})

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    let text = msg.text
    const username = msg.chat.first_name
    
    if (msg.forward_from_chat) {
        bot.sendMessage(chatId, 'Botga xabar yuborish mumkin emas!!!')
    }
    
    const userStep = chatStep.find(item => item.chatId === chatId)

    if(text === "/start") {
        chatStep.push({
            chatId
        })
        await bot.sendMessage(
            chatId, 
            `Salom ${username}, botimizga xush kelibsiz! \nBu bot orqali mahallamiz uchun ovoz berishingiz mumkin. ✅\n\n<b>Unutmang sizning ovozingiz bizning mahallamiz obodonlashtirish uchun juda muhim. 🤩</b>`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [
                        [`🗳 Ovoz berish`],
                    ],
                    resize_keyboard: true,    
                }
            }
        )
    } else if (text === "🗳 Ovoz berish") {
        userStep.step = 1
        await bot.sendMessage(chatId, `<b>Raqamni quyidagi formatda kiriting.</b> <i>Misol: +998901234567</i>`, {
            parse_mode: 'HTML',
            reply_markup: {
                remove_keyboard: true
            }
        })
    } else if (userStep.step === 1){
        if(text.slice(0, 4) !== '+998') {
            return bot.sendMessage(chatId, `Botda faqat o'zbek raqamlaridan ro'yxatdan o'tish mumkun!`, {
                reply_markup: {
                    keyboard: [
                        [`🗳 Ovoz berish`],
                    ],
                    resize_keyboard: true, 
                }
            })
        } else {
            // db.get(`SELECT * FROM users WHERE phone = "${text}"`, (err, row) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         if (row) {
            //             if(row.phone === text) {
            //                 bot.sendMessage(chatId, `Bu raqamdan avval ovoz berilgan, Boshqa raqamdan ovoz bering`, {
            //                     parse_mode: 'HTML',
            //                     reply_markup: {
            //                         keyboard: [
            //                             [`🗳 Ovoz berish`],
            //                         ],
            //                         resize_keyboard: true, 
            //                     }
            //                 })
            //             } 
            //         } else {
                        userStep.phone = text
                        bot.sendMessage(chatId, `Ovoz berish uchun «Ovoz berish 🚀» knopkani bosing va SAYTga kirib ovoz bering. 
                        \n❗️Ovoz berganingizdan so'ng botga qayting va «Ovoz berdim ✅» knopkasini bosing!
                        
                        \nBekor qilish: /start`, {
                            reply_markup: {
                                parse_mode: 'HTML',
                                remove_keyboard: true,
                                inline_keyboard: [
                                    [
                                        {
                                            text: `Ovoz berish 🚀`, 
                                            web_app: {
                                                url: web_link
                                            }
                                        }
                                    ],
                                    [
                                        {
                                            text: `Ovoz berdim ✅`,
                                            callback_data: 'complete'
                                        }
                                    ]
                                ],
                            }
                        })
                    }
                // }
            // })
        // }
    } else {
        bot.sendMessage(chatId,c `Notog'ri buyruq kiritildi!`, {
            reply_markup: {
                remove_keyboard: true,
            }
        })
    }
})