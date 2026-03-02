const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Relais BusEye opérationnel (lecture + écriture)');
});

// Route pour recevoir les positions des bus (écriture)
app.post('/api/position', async (req, res) => {
    const { busId, lat, lng, speed } = req.body;
    if (!busId || !lat || !lng) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    const firebaseUrl = `https://bus-scolaire---iug-default-rtdb.europe-west1.firebasedatabase.app/bus_positions/${busId}.json`;
    const data = {
        lat, lng,
        speed: speed || 0,
        timestamp: Date.now()
    };

    try {
        await fetch(firebaseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// NOUVELLE ROUTE : Récupérer toutes les positions (lecture)
app.get('/api/positions', async (req, res) => {
    const firebaseUrl = 'https://bus-scolaire---iug-default-rtdb.europe-west1.firebasedatabase.app/bus_positions.json';
    try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur relais démarré sur le port ${port}`);
});
