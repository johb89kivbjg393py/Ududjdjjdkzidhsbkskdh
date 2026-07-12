const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Instances موثوقة (أضف المزيد)
const INSTANCES = [
  "https://cobalt.canine.tools",
  "https://cobalt.tools",
  "https://co.wuk.sh"
];

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { url, quality } = req.body;

    if (!url) {
        return res.status(400).json({ error: { code: "no_url" } });
    }

    // اختيار instance عشوائي
    const baseUrl = INSTANCES[Math.floor(Math.random() * INSTANCES.length)];

    try {
        const payload = {
            url: url,
            videoQuality: quality === '4k' ? '2160' : quality === '1080' ? '1080' : '720',
            audioFormat: quality === 'mp3' ? 'mp3' : 'best',
            filenameStyle: "pretty",
            downloadMode: quality === 'mp3' ? "audio" : "auto"
        };

        const response = await axios.post(`${baseUrl}/api/json`, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 25000
        });

        res.json(response.data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ 
            status: "error", 
            error: { code: "proxy_failed" } 
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ MeowDownloader Proxy Server يعمل على: http://localhost:${PORT}`);
});
