const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// Accepter toutes les origines (pour le développement)
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Relais BusEye opérationnel avec CORS');
});

app.post('/api/position', async (req, res) => {
    const { busId, lat, lng, speed } = req.body;
    if (!busId || !lat || !lng) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    const firebaseUrl = `https://bus-scolaire---iug-default-rtdb.europe-west1.firebasedatabase.app/bus_positions/${busId}.json`;
    const data = {
        lat,
        lng,
        speed: speed || 0,
        timestamp: Date.now()
    };

    try {
        const response = await fetch(firebaseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        res.json({ success: true, firebase: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur relais démarré sur le port ${port}`);
});
