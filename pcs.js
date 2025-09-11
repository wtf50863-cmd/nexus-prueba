// api/pcs.js
import mongoose from "mongoose";

/* variables de entorno soportadas */
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;

/* conexión cached para serverless */
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!MONGO_URI) {
    // no conectamos si falta la URI; dejar que el handler devuelva el error
    throw new Error("Missing MONGO_URI");
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/* esquema y modelo (definidos una sola vez) */
const LaptopSchema = new mongoose.Schema({
  nombre: String,
  marca: String,
  precio: Number,
  moneda: String,
  img: String,
  especificaciones: {
    procesador: String,
    ram: String,
    almacenamiento: String,
    pantalla: String,
    grafica: String
  }
}, { timestamps: true });

const Laptop = mongoose.models.Laptop || mongoose.model("Laptop", LaptopSchema);

/* handler exportado (único export) */
export default async function handler(req, res) {
  // 1) comprobar variable de entorno antes de intentar conectar
  if (!MONGO_URI) {
    return res.status(500).json({
      error: "Falta la variable de entorno MONGO_URI (o MONGODB_URI / MONGO_URL) en Vercel"
    });
  }

  // 2) conectar a MongoDB (cached)
  try {
    await dbConnect();
  } catch (err) {
    console.error("Error conectando a Mongo:", err);
    return res.status(500).json({ error: "Error conectando a MongoDB" });
  }

  // 3) manejador de métodos
  try {
    if (req.method === "GET") {
      const laptops = await Laptop.find({}).lean();
      return res.status(200).json(laptops);
    }

    if (req.method === "POST") {
      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Body vacío. Envía JSON con los campos de la laptop." });
      }
      const created = await Laptop.create(data);
      return res.status(201).json(created);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error("Error en /api/pcs:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
