const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-2-27b-it';

async function analyzeImageForPeople(imagePath) {
  try {
    const safePath = path.normalize(imagePath).replace(/^(\.\.(\/|\\|$))+/, '');
    if (!fs.existsSync(safePath)) {
      throw new Error('Archivo no encontrado');
    }
    
    const imageData = fs.readFileSync(safePath);
    const imageBase64 = imageData.toString('base64');
    
    const prompt = `Analiza esta imagen y responde únicamente con un número que indique la cantidad de personas detectadas.`;
    
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { 
              type: "image_url", 
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            }
          ]
        }
      ],
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = response.data.choices[0].message.content.trim();
    const personCount = parseInt(result, 10);
    
    return {
      personCount: isNaN(personCount) ? 0 : personCount,
      description: result
    };
  } catch (error) {
    console.error('Error al analizar la imagen:', error.message);
    return {
      error: 'Error procesando la imagen'
    };
  }
}

module.exports = { analyzeImageForPeople };