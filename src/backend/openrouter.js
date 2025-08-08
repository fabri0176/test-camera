const axios = require('axios');
const config = require('../config/config');

const OPENROUTER_API_KEY = config.openRouter.apiKey;
const OPENROUTER_MODEL = config.openRouter.model;
const OPENROUTER_URL = config.openRouter.apiUrl;
const OPENROUTER_PROMPT = config.openRouter.prompt;
const OPENROUTER_MAX_TOKENS = config.openRouter.maxTokens;

async function analyzeImageForPeople(imagePath) {
  try {
    const fs = require('fs');
    const imageData = fs.readFileSync(imagePath);
    const imageBase64 = imageData.toString('base64');
    
    const prompt = OPENROUTER_PROMPT;
    
    const response = await axios.post(OPENROUTER_URL, {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: OPENROUTER_MAX_TOKENS
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = response.data.choices[0].message.content.trim();
    
    const personCount = parseInt(result, 10);
    
    if (isNaN(personCount)) {
      return {
        personCount: 0,
        description: result
      };
    }
    
    return {
      personCount: personCount,
      description: result
    };
  } catch (error) {
    console.error('Error al analizar la imagen con OpenRouter:', error.message);
    
    return {
      error: 'No se pudo analizar la imagen. Por favor, verifica tu API key de OpenRouter y asegúrate de que el modelo esté disponible.'
    };
  }
}

module.exports = { analyzeImageForPeople };