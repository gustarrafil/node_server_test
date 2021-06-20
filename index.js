
const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());
// app.listen(3000);

app.get('/', function(req, res){res.send('Hello world')});

/*
  Servidor propriamente dito
*/

const transactions = [
    {
        "id": 0,
        "currencyPair": "btc",
        "buySell": true,
        "orderPrice": 34,
        "quantity": 0.05,
        // "triggerValue": 123,
        // "trigger": true,
        "wallet": 100.0,
        "dateTime": date = new Date(),
        // "userName": "gustavo",
    }
]
const usuarios = [
    {
        "id": 0,
        "userName": "gustavoendpoint",
    }
]

const endpoint = "/transactions";
const endpointConta = "/account";

app.get(endpoint, function(req, res){
    res.send(transactions.filter(Boolean));
});
app.get(endpointConta, function(req, res){
    res.send(usuarios.filter(Boolean));
});

app.get(`${endpoint}/:id`, function(req, res){
    const id = req.params.id;
    const transaction = transactions[id];

    if (!transaction){
        res.send("{}");
    } else {
        res.send(transaction);
    }   
});
app.get(`${endpointConta}/:id`, function(req, res){
    const id = req.params.id;
    const usuario = usuarios[id];

    if (!usuario){
        res.send("{}");
    } else {
        res.send(usuario);
    }   
});

app.post(endpoint, (req, res) => {
    const transaction = {
        id: transactions.length,
        currencyPair: req.body["currencyPair"],
        buySell: req.body["buySell"],
        orderPrice: req.body["orderPrice"],
        quantity: req.body["quantity"],
        // triggerValue: req.body["triggerValue"],
        // trigger: req.body["trigger"],
        wallet: req.body["wallet"],
        dateTime: req.body["dateTime"],
        // userName: req.body["userName"],
    };
    transactions.push(transaction);
    res.send("1");
    notify();
});
app.post(endpointConta, (req, res) => {
    const usuario = {
        id: usuarios.length,
        userName: req.body["userName"],
    };
    usuarios.push(usuario);
    res.send("1");
    notify();
});



app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const transaction = {
        id : id,
        currencyPair: req.body["currencyPair"],
        buySell: req.body["buySell"],
        orderPrice: req.body["orderPrice"],
        quantity: req.body["quantity"],
        // triggerValue: req.body["triggerValue"],
        // trigger: req.body["trigger"],
        wallet: req.body["wallet"],
        dateTime: req.body["dateTime"],
        // userName: req.body["userName"],
    };

    transactions[id] = transaction;
    res.send("1");

    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete transactions[id];
    res.send("1");

    // Notificar todos
    notify();
});


/*
  Criar um socket para notificar usuários das mudanças.
*/


const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Comunicação
const INVALIDATE = 'invalidate';

function notify(){
    io.sockets.emit(INVALIDATE, 1);
}

server.listen(process.env.PORT || 3000);