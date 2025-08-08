const { analyzeImageForPeople } = require('../services/imageAnalysisService');
const fs = require('fs');
const path = require('path');

exports.analyzeImage = async (req, res) => {
  const { filename } = req.params;
  
  const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
  const filepath = path.join('uploads', safeFilename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
  
  try {
    const result = await analyzeImageForPeople(filepath);
    res.json({
      message: 'Imagen analizada correctamente',
      filename: filename,
      analysis: result
    });
  } catch (error) {
    console.error('Error al analizar la imagen:', error);
    res.status(500).json({
      error: 'Error al analizar la imagen',
      details: error.message
    });
  }
};