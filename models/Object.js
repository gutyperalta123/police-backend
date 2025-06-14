const mongoose = require('mongoose')

const objectSchema = new mongoose.Schema({
  comisaria: String,
  tipo: String,
  marca: String,
  modelo: String,
  imei: String,
  numero_serie: String,
  numero_motor: String,
  numero_cuadro: String,
  numero_dominio: String,
  color: String,
  caracteristicas: String,
  denunciante: String,
  dni_denunciante: String,
  fiscal: String,
  descripcion: String,
  fecha: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Object', objectSchema)
