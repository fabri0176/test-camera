const { analyzeImageForPeople } = require('../services/imageAnalysisService');

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
  }
  
  try {
    const result = await analyzeImageForPeople(req.file.path);
    res.json({
      message: 'Imagen subida y analizada correctamente',
      filename: req.file.filename,
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