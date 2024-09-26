const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/generate-audio', async (req, res) => {
    const { name } = req.body;
    // const text = `Just saw your appointment come in! Super excited to get to know more about you, ${name}! Make sure you watch this video so you can have an idea of what we do here and what we’re going to be talking about on your call.`;
    const text = `Yo yo haha${name}! ho ho hahah hoho .`;
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
        const randomFileName = `audio_${uuidv4()}.mp3`;
        const audioFilePath = randomFileName;
        const url = `${req.protocol}://${req.get('host')}/audio/${randomFileName}`;
        fs.writeFileSync(audioFilePath, response.data);
        const responsePayload = {
            "version": "v2",
            "content": {
                "messages": [
                    {
                        "type": "audio",
                        url,
                        "buttons": []
                    }
                ],
                "actions": [],
                "quick_replies": []
            }
        };
    
        res.json(responsePayload);
    } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).send('Error generating audio');
    }
});

app.get('/audio/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, fileName);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log(`File ${fileName} deleted successfully`);
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

