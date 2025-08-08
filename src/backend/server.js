const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static('src/frontend'));


const routes = require('../routes');

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});