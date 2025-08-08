const { analyzeImageForPeople } = require('../backend/openrouter');
const fs = require('fs');
const path = require('path');

exports.captureImage = async (req, res) => {
  const { image } = req.body;
  
  if (!image) {
    return res.status(400).json({ error: 'No se ha recibido ninguna imagen' });
  }
  
  const matches = image.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: 'Formato de imagen inválido' });
  }
  
  const filename = Date.now() + '.png';
  const filepath = path.join('uploads', filename);
  
  try {
    const buffer = Buffer.from(matches[2], 'base64');
    fs.writeFileSync(filepath, buffer);
    
    const result = await analyzeImageForPeople(filepath);
    res.json({
      message: 'Imagen capturada y analizada correctamente',
      filename: filename,
      analysis: result
    });
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).json({
      error: 'Error procesando la imagen',
      details: error.message
    });
  }
};