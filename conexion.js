//Crear la API en Express con conexión a atlas
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('¡Conectado a MongoDB Atlas!'))
    .catch(err => console.error('Error al conectar:', err));

// Esquema y modelo
const pcSchema = new mongoose.Schema({
    nombre: String,
    marca: String,
    precio: Number,
    moneda: String,
    especificaciones: {
        procesador: String,
        ram: String,
        almacenamiento: String,
        pantalla: String,
        grafica: String
    },
    img: String
});
const Pc = mongoose.model('Pc', pcSchema);

// Endpoints para listar y crear usuarios
app.post('/api/pcs', async (req, res) => {
    const pc = new Pc(req.body);
    await pc.save();
    res.json(pc);
});

app.get('/api/pcs', async (req, res) => {
    const pcs = await Pc.find();
    res.json(pcs);
});

//Iniciar el servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor activo en puerto ${process.env.PORT}`);
});
