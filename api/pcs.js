// api/pcs.js
import mongoose from "mongoose";

/**
 * Usa cualquiera de estas variables de entorno si la tienes llamada distinto:
 * - MONGO_URI
 * - MONGODB_URI
 * - MONGO_URL
 */
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGO_URI) {
  // Responder aquí para que el error sea claro en deploy si falta la var
  // (No lanzar excepción sin respuesta porque en Vercel rompería la función)
  export default function handler(req, res) {
    res.status(500).json({ error: "Falta la variable de entorno MONGO_URI (o MONGODB_URI / MONGO_URL)" });
  }
  // Guardamos export default ya que el bloque arriba corta la ejecución si no hay URI.
}

/* ------------------ conexión cached (para serverless) ------------------ */
let cached = global._mongoose; // persistente entre invocaciones en el mismo runtime
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // already connected
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        // opciones recomendadas
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/* ------------------ esquema y modelo ------------------ */
const LaptopSchema = new mongoose.Schema({
  nombre: { type: String },
  marca: { type: String },
  precio: { type: Number },
  moneda: { type: String },
  img: { type: String },
  especificaciones: {
    procesador: String,
    ram: String,
    almacenamiento: String,
    pantalla: String,
    grafica: String
  }
}, { timestamps: true });

const Laptop = mongoose.models.Laptop || mongoose.model("Laptop", LaptopSchema);

/* ------------------ handler principal ------------------ */
export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (err) {
    console.error("Error conectando a Mongo:", err);
    return res.status(500).json({ error: "Error conectando a MongoDB" });
  }

  try {
    if (req.method === "GET") {
      const laptops = await Laptop.find({}).lean();
      return res.status(200).json(laptops);
    }

    if (req.method === "POST") {
      // Asume que el body viene en JSON (fetch con headers: {'Content-Type':'application/json'})
      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Body vacío. Envía JSON con los campos de la laptop." });
      }
      const created = await Laptop.create(data);
      return res.status(201).json(created);
    }

    // Métodos no permitidos
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error("Error en /api/pcs:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
