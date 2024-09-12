const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.get('/', async (req, res) => {
//     res.status(200).send('Error generating audio');
// });
app.post('/generate-audio', async (req, res) => {
    const { name } = req.body;
    const text = `Just saw your appointment come in! Super excited to get to know more about you, ${name}! Make sure you watch this video so you can have an idea of what we do here and what we’re going to be talking about on your call.`;
    const requestBody = {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
        }
    };
    const headers = {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': 'sk_6a4cdf8d3a6bef70f3347decdbc53458b95cb08db22d8d88'
    };
    try {
        const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/Rp7dAf99N16yxa9e9HJs', requestBody, {
            headers,
            responseType: 'arraybuffer'
        });

        const audioFilePath = 'output.mp3';
        fs.writeFileSync(audioFilePath, response.data);

        res.sendFile(audioFilePath, { root: __dirname });
    } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).send('Error generating audio');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
