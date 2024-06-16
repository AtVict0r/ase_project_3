const express = require('express');
const fs = require('fs');
const game = require ('./data/game');

const port = 3000;

const app = express();

// Helper function to write data to the JSON file
const writeGameToFile = (gameData) => {
    fs.writeFile('./data/game.json', JSON.stringify(gameData, null, 2), (err) => {
        if (err) throw err;
    });
};

// Middleware to parse JSON requests
app.use(express.json());

// GET all game objects
app.get('/games', (req, res) => {
    res.json(game);
});

// GET a specific game object by ID
app.get('/game/:id', (req, res) => {
    const { id } = req.params;
    const gameObject = game.find((x) => x.id == id);

    if (!gameObject) {
        res.status(404).json({ error: 'Game object not found' });
    } else {
        res.json(gameObject);
    }
});

// POST a new game object
app.post('/game', (req, res) => {    
    const newGameObj = req.body;
    const newId = game.length > 0 ? Math.max(...game.map((obj) => obj.id)) + 1 : 1;
    const gameObjectWithId = { id: newId, ...newGameObj };

    game.push(gameObjectWithId);
    // Write the updated game array to the file
    writeGameToFile(game);
    res.status(201).json(newGameObj);
});

// POST multiple new game objects
app.post('/games', (req, res) => {
    const newGameObjects = req.body;

    // Check if the body is an array of objects
    if (Array.isArray(newGameObjects)) {
        newGameObjects.forEach((newGameObj) => {
            // Assign a new unique ID
            const newId = game.length > 0 ? Math.max(...game.map((obj) => obj.id)) + 1 : 1;
            const gameObjectWithId = { id: newId, ...newGameObj };
            game.push(gameObjectWithId);
            // Write the updated game array to the file
            writeGameToFile(game);
        });
        res.status(201).json(newGameObjects);
    } else {
        res.status(400).json({ error: 'Input should be an array of game objects' });
    }
});

// PUT (update) a game object by ID
app.put('/game/:id', (req, res) => {
    const { id } = req.params;
    const updatedGameObj = req.body;
    const index = game.findIndex((x) => x.id == id);

    if (index === -1) {
        res.status(404).json({ error: 'Game object not found' });
    } else {
        game[index] = { ...game[index], ...updatedGameObj };
        // Write the updated game array to the file
        writeGameToFile(game);
        res.json(game[index]);
    };

});

// DELETE a game object by ID
app.delete('/game/:id', (req, res) => {
    const { id } = req.params;
    const index = game.findIndex((x) => x.id == id);

    if (index === -1) {
        res.status(404).json({ error: 'Game object not found' });
    } else {
        const deletedGameObj = game.splice(index, 1);
        // Write the updated game array to the file
        writeGameToFile(game);
        res.json(deletedGameObj);
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));