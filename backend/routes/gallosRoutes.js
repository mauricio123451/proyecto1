const express = require('express');
const Gallo = require('../models/Gallo');
const router = express.Router();

// Ruta para crear un gallo
router.post('/gallos', async (req, res) => {
  const { id_gallo, numero_lote, cruza, marcas, foto, cantidad } = req.body;  // Aquí agregas cantidad

  try {
    const gallo = new Gallo({
      id_gallo,
      numero_lote,
      cruza,
      marcas,
      foto,
      cantidad,  // Nuevo campo cantidad
    });
    await gallo.save();
    res.status(201).json(gallo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para actualizar un gallo
router.put('/gallos/:id', async (req, res) => {
  const { id_gallo, numero_lote, cruza, marcas, foto, cantidad } = req.body;  // Aquí agregas cantidad

  try {
    const gallo = await Gallo.findByIdAndUpdate(
      req.params.id,
      { id_gallo, numero_lote, cruza, marcas, foto, cantidad }, // Asegúrate de incluir cantidad en la actualización
      { new: true }
    );
    res.json(gallo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
