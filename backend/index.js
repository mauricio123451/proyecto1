// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Configuración del servidor
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado')).catch(err => console.log(err));

// Definir esquema y modelo
const GalloSchema = new mongoose.Schema({
    id_gallo: { type: String, required: true },
    lote: { type: String, required: true },
    cruza: { type: String, required: true },
    marcas: { type: String, required: true },
    foto: { type: String } // Guardamos la URL de la imagen
});
const Gallo = mongoose.model('Gallo', GalloSchema);

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Rutas del CRUD
// Crear un gallo
app.post('/gallos', upload.single('foto'), async (req, res) => {
    try {
        const { id_gallo, lote, cruza, marcas } = req.body;
        const foto = req.file ? `/uploads/${req.file.filename}` : '';
        const nuevoGallo = new Gallo({ id_gallo, lote, cruza, marcas, foto });
        await nuevoGallo.save();
        res.json(nuevoGallo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los gallos
app.get('/gallos', async (req, res) => {
    const gallos = await Gallo.find();
    res.json(gallos);
});

// Obtener un gallo por ID
app.get('/gallos/:id', async (req, res) => {
    const gallo = await Gallo.findById(req.params.id);
    res.json(gallo);
});

// Actualizar un gallo
app.put('/gallos/:id', upload.single('foto'), async (req, res) => {
    try {
        const { id_gallo, lote, cruza, marcas } = req.body;
        const foto = req.file ? `/uploads/${req.file.filename}` : req.body.foto;
        const galloActualizado = await Gallo.findByIdAndUpdate(req.params.id, { id_gallo, lote, cruza, marcas, foto }, { new: true });
        res.json(galloActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un gallo
app.delete('/gallos/:id', async (req, res) => {
    await Gallo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Gallo eliminado' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
