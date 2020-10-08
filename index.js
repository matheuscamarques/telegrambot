const TelegramBot = require( `node-telegram-bot-api` )

const TOKEN = `1275439917:AAFK-upfxrukXU_Zg7fwYhbMU57BmFjXCtU`

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, {polling: true});



var estados = ['inicio' , 'fim' ];
var pilhaDebitos = [];

bot.onText(/\/parcelamento/, (msg) => {
  //eventos.push(new Parcelamento());
  bot.sendMessage(msg.chat.id, "Selecione a Opção de Parcelamento:", {
  "reply_markup": {
      "keyboard": [  ["Adicionar Debitos", "Remover Debito"] ,   ["Simular"], ["Finaliza"] ]
      }
  });
      
});




bot.onText(/([A-Z a-z]{1,50}) \- (?:[1-9][0-9]?[0-9]?[0-9]?[0-9]?(,[0-9][0-9])?)/g, (msg,match) => {
 
  let mensagem = match[0];
  //let debitos = mensagem.match( reg3 ); for ( debito of debitos ) { [descricao, valor] = debito.split(` - `); console.log(descricao); console.log(valor); }
  bot.sendMessage(msg.chat.id,mensagem,{
    "reply_markup": {
        "inline_keyboard": [[{text:"Adicionar Debito",callback_data:"addDebito"}], [{text:"Remover Debito",callback_data:"Remover"}]]
        }
    }); 
});


bot.on('callback_query', (query) => {
      var data = query.data;
      var chat_id = query.message.chat.id;
      var message_id = query.message.message_id;
      
      //console.log(query.message);

      if( data == "addDebito" ){
          //bot.editMessageText("Done Clicked");
          let debito = query.message.text;
          [descricao, valor] = debito.split(` - `); 
          
          pilhaDebitos.push({"id_msg":query.message.message_id,"descricao":descricao,"valor":valor,"data":query});
          console.log(pilhaDebitos);
          bot.editMessageReplyMarkup({
            inline_keyboard: [[{text: "Remover Débito",callback_data: "Remover"}],]}, {chat_id: query.message.chat.id, message_id: query.message.message_id
          });
          bot.sendMessage(chat_id,JSON.stringify(pilhaDebitos));
      }

      if(data == "Remover"){
            let debito = query.message.text;
            [descricao, valor] = debito.split(` - `); 
            
            for(i=0;i<pilhaDebitos.length;i++){
                if(pilhaDebitos[i].id_msg == query.message.message_id){
                      pilhaDebitos.splice(i,1);
                }
            }
            bot.deleteMessage(chat_id,message_id)
            bot.sendMessage(chat_id,JSON.stringify(pilhaDebitos));
      }

      if( data == "encerrar" ){
        //bot.editMessageText("Done Clicked");
        bot.sendMessage(chat_id,"Encerrado")
      }
});