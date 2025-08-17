import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Middleware API Key
const validKey = 'ALsZU6l6dNSWfu0uhVQXq60Y9xQ7bXa7GgfgWJD8UOUdG0xAOwSebAxtIBwlnNOi'; // Ganti sesuai kebutuhan
const limits = new Map(); // Simpan data limit API Key

function resetLimits() {
    limits.clear();
}
setInterval(resetLimits, 24 * 60 * 60 * 1000); // Reset setiap 24 jam

app.use((req, res, next) => {
    const apiKey = req.query.apikey;
    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({ status: false, message: 'Invalid API Key' });
    }

    const usage = limits.get(apiKey) || 0;
    if (usage >= 10) {
        return res.status(429).json({
            status: false,
            message: 'Limit tercapai (10 request per hari). Tunggu besok.'
        });
    }
    limits.set(apiKey, usage + 1);
    next();
});

// Custom Headers (User-Agent)
const headers = {
    'User-Agent': 'MyCekIDApp/1.0 (https://yourdomain.com)'
};

// Route: Cek ID Mobile Legends
app.get('/api/cekid/mlbb', async (req, res) => {
    const { id, zone } = req.query;
    if (!id || !zone) return res.json({ status: false, message: 'Masukkan id & zone' });

    try {
        const response = await fetch(`https://vip-reseller.co.id/api/game-feature?game=mlbb&id=${id}&zone=${zone}&key=API_VIPRESELLER`, {
            headers
        });
        const data = await response.json();
        res.json({ status: true, message: 'Success', data });
    } catch (err) {
        res.json({ status: false, message: 'Error', error: err.message });
    }
});

// Route: Cek ID Free Fire
app.get('/api/cekid/freefire', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.json({ status: false, message: 'Masukkan id' });

    try {
        const response = await fetch(`https://vip-reseller.co.id/api/game-feature?game=freefire&id=${id}&key=API_VIPRESELLER`, {
            headers
        });
        const data = await response.json();
        res.json({ status: true, message: 'Success', data });
    } catch (err) {
        res.json({ status: false, message: 'Error', error: err.message });
    }
});

// Route: Cek ID Genshin Impact
app.get('/api/cekid/genshin', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.json({ status: false, message: 'Masukkan id' });

    try {
        const response = await fetch(`https://vip-reseller.co.id/api/game-feature?game=genshin&id=${id}&key=API_VIPRESELLER`, {
            headers
        });
        const data = await response.json();
        res.json({ status: true, message: 'Success', data });
    } catch (err) {
        res.json({ status: false, message: 'Error', error: err.message });
    }
});

// Route: Cek PLN
app.get('/api/cekpln', async (req, res) => {
    const { nomor_meter } = req.query;
    if (!nomor_meter) return res.json({ status: false, message: 'Masukkan nomor meter' });

    try {
        const response = await fetch(`https://vip-reseller.co.id/api/pln?meter=${nomor_meter}&key=API_VIPRESELLER`, {
            headers
        });
        const data = await response.json();
        res.json({ status: true, message: 'Success', data });
    } catch (err) {
        res.json({ status: false, message: 'Error', error: err.message });
    }
});

export default app;
