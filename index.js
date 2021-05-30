// https://server-test-aula-mobile.herokuapp.com/


const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());
// app.listen(3000);


app.get('/', function(req, res){res.send('pagina inicial')});

/*
  Servidor propriamente dito
*/

const notes = [
    {
        id: 0, 
        title: "Vinícius Nonato Rodrigues", 
        description : "Aluno da Unicamp feliz"
    },
    {
        id: 1, 
        title: "Carolina da Silva Sancho", 
        description : "Aluna da Unicamp não tão feliz"
    }
]
const transactions = []

const endpoint = "/notes";
const endpointTransaction = "/transaction";

app.get(endpoint, function(req, res){
    res.send(notes.filter(Boolean));
});
app.get(endpointTransaction, function(req, res){
    res.send(transactions.filter(Boolean));
});

app.get(`${endpoint}/:id`, function(req, res){
    const id = req.params.id;
    const note = notes[id];

    if (!note){
        res.send("{}");
    } else {
        res.send(note);
    }   
});
app.get(`${endpointTransaction}/:transactionId`, function(req, res){
    const transactionId = req.params.transactionId;
    const transaction = transactions[transactionId];

    if (!transaction){
        res.send("{}");
    } else {
        res.send(transaction);
    }   
});

app.post(endpointTransaction, (req, res) => {
    const transaction = {
        id : transactions.length,
        title : req.body["title"],
        description : req.body["description"]
    };
    transactions.push(transaction);
    res.send("1");

    notify();
});
app.post(endpoint, (req, res) => {
    const note = {
        id : notes.length,
        title : req.body["title"],
        description : req.body["description"]
    };
    notes.push(note);
    res.send("1");

    notify();
});

app.put(`${endpointTransaction}/:transactionId`, (req, res) =>{
    const transactionId = parseInt(req.params.transactionId);
    const transaction = {
        id : transactionId,
        title : req.body["title"],
        description : req.body["description"]
    };

    transactions[transactionId] = transaction;
    res.send("1");

    notify();
});
app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const note = {
        id : id,
        title : req.body["title"],
        description : req.body["description"]
    };

    notes[id] = note;
    res.send("1");

    notify();
});

app.delete(`${endpointTransaction}/:transactionId`, (req, res) => {
    const transactionId = req.params.transactionId;
    delete transactions[transactionId];
    res.send("1");

    // Notificar todos
    notify();
});
app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete notes[id];
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