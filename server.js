const express = require('express');
const bodyParser = require('body-parser');
const adaptor = require('./index');

const app = express();
app.use(bodyParser.json());

app.post('/', function (req, res) {
    adaptor.handler(req, res)
});

let listener = app.listen(process.env.PORT, function () {
    console.log("Tensorfloracle External Adaptor listening on", listener.address().address + listener.address().port);
});
