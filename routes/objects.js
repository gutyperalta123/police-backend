const express = require('express')
const router = express.Router()
const ObjectItem = require('../models/Object')
const auth = require('../middleware/auth')
const { onlyAdmin } = require('../middleware/role')

router.post('/', auth, async (req, res) => {
  try {
    const nuevo = new ObjectItem(req.body)
    await nuevo.save()
    res.status(201).json({ msg: 'Objeto registrado' })
  } catch (err) {
    res.status(500).json({ msg: 'Error al registrar' })
  }
})

router.get('/search', auth, async (req, res) => {
  const q = req.query.q?.toUpperCase() || ''
  try {
    const resultados = await ObjectItem.find({
      $or: [
        { imei: { $regex: q } },
        { numero_serie: { $regex: q } },
        { numero_motor: { $regex: q } },
        { numero_cuadro: { $regex: q } },
        { numero_dominio: { $regex: q } },
        { tipo: { $regex: q } },
        { marca: { $regex: q } },
        { modelo: { $regex: q } },
        { color: { $regex: q } },
        { denunciante: { $regex: q } },
{ dni_denunciante: { $regex: q } }

      ]
    }).sort({ fecha: -1 })
    res.json(resultados)
  } catch {
    res.status(500).json({ msg: 'Error en la búsqueda' })
  }
})

router.delete('/:id', auth, onlyAdmin, async (req, res) => {
  try {
    await ObjectItem.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Objeto eliminado' })
  } catch {
    res.status(500).json({ msg: 'Error al eliminar' })
  }
})

module.exports = router
