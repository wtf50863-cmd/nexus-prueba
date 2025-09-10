import mongoose from "mongoose";

const uri = process.env.MONGO_URI; // en Vercel lo configuras en "Environment Variables"

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
});

let Laptop;
try {
  Laptop = mongoose.model("Laptop");
} catch {
  Laptop = mongoose.model("Laptop", LaptopSchema);
}

export default async function handler(req, res) {
  await mongoose.connect(uri);

  if (req.method === "GET") {
    const laptops = await Laptop.find();
    res.status(200).json(laptops);
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}


export default function handler(req, res) {
  res.status(200).json({ mensaje: "API funcionando 🚀" });
}

export default function handler(req, res) {
  res.status(200).json([
    { nombre: "Laptop ejemplo", precio: 1000, moneda: "USD" }
  ]);
}