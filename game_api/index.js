const express = require('express');
const game = require('./data/game.json')

const port = 3000;

const app = express();

app.get('/game', (req, res) => {
    // console.log('requesting game');
    // res.send('requesting game');
    res.json(game)
});

app.listen(port, () => console.log(`Listening on port ${port}`));