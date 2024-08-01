// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const banco = require('./src/banco')

venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function start(client) {
  client.onMessage(async (message) => {
    const userCadastrado = banco.db.find(numero => numero.num === message.from);

    if(!userCadastrado){
        console.log("cadastrando usuário")
        banco.db.push({num: message.from, name: message.sender.pushname, historico: []})
    }else{
        console.log("usuário já cadastrado")
    }

    const historico = banco.db.find(num => num.num === message.from);
    historico.historico.push('user: ' + message.body);

    if(!message.isGroupMsg){
        if (message.body.toLocaleLowerCase().includes("oi") || message.body.toLocaleLowerCase().includes("boa") || message.body.toLocaleLowerCase().includes("bom") || message.body.toLocaleLowerCase().includes("olá") ){
            client.sendText(message.from, `Olá ${historico.name}, Tudo bem? Este é o autoatendimento da GK! 🤖`)
            await sleep(500);
            client.sendText(message.from, 'Digite o número correspondente à sua solicitação!\n\n1 - Cárdapio 🧾\n2 - Fazer pedido 🛍️\n3 - Prêmios 🏆\n4 - Faça sua encomenda 🎂\n5 - Fidelidade 🫱🏾‍🫲🏾\n6 - Forma de pagamento 💵\n7 - Falar com a atendente 🙋‍♀️')
        }

        const contemOi = historico.historico.some((item) => item.toLocaleLowerCase().includes('oi'));
        const contemOla = historico.historico.some((item) => item.toLocaleLowerCase().includes('olá'));
        const contemBom = historico.historico.some((item) => item.toLocaleLowerCase().includes('bom'));
        const contemBoa = historico.historico.some((item) => item.toLocaleLowerCase().includes('boa'));
        
        if (contemOi || contemOla || contemBom || contemBoa){
            if (!(isNaN(message.body)) || message.body.toLocaleLowerCase().includes('atendente')){
                switch (message.body.toLocaleLowerCase()) {
                    case '1':
                        client.sendText(message.from, 'Veja aqui o nosso cardápio: https://gkdocesartesanais.alloy.al/loja/pedidos\n\nQualquer dúvida digite "Falar com a atendente" e estarei aqui 😊')
                        break;
                    case '2':
                        client.sendText(message.from, 'Você pode fazer seu pedido através do nosso cardápio: https://gkdocesartesanais.alloy.al/loja/pedidos\n\nÉ super rápido e fácil! 📲\n\nQualquer dúvida digite "Falar com a atendente" e estarei aqui 😊')
                        break;
                    case '3':
                        client.sendText(message.from, 'Perfeito! Confira seus prêmios disponíveis 🎁 e como resgatar aqui: https://gkdocesartesanais.alloy.al/loja/fidelidade\nQualquer dúvida digite "Falar com a atendente" e estarei aqui 😊');
                        break;
                    case '4':
                        client.sendText(message.from, 'Acesse o link : https://mssg.me/gkdocesartesanais e escolha seus produtos\n\nQualquer dúvida digite "Falar com a atendente" e estarei aqui 😊');
                        break;
                    case '5':
                        client.sendText(message.from, 'Temos um programa de fidelidade incrível! 🌟 A cada 1 real em compras, você ganha 1 ponto! Confira os produtos disponíveis para resgate aqui 🎁: https://gkdocesartesanais.alloy.al/loja/fidelidade\n\nQualquer dúvida digite "Falar com a atendente" e estarei aqui 😊');
                        break;
                    case '6':
                        client.sendText(message.from, 'Para pagar é fácil!\n\nAcesse seu banco de preferência e cole:\nChave: 51681219000134\nFavorecido: GLEICE KELLY - GK DOCES ARTESANAIS\n\nAh! e não esqueça de *mandar o comprovante* 😉\n\nQualquer dúvida digite "Falar com a atendente" e estarei aqui 😊');
                        break;
                    case '7':
                        client.sendText(message.from, 'Por favor, aguarde um momento enquanto chamo um de nossos atendentes.🙍‍♀️📳');
                        break;
                    case 'atendente':
                        client.sendText(message.from, 'Por favor, aguarde um momento enquanto chamo um de nossos atendentes.🙍‍♀️📳');
                }
            }
        }
    }
  });
}