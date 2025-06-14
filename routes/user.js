const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { onlyAdmin } = require('../middleware/role')

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username: username.toUpperCase() })
    if (!user) return res.status(401).json({ msg: 'Credenciales inválidas' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ msg: 'Credenciales inválidas' })

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '12h'
    })

    res.json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
})

router.post('/create', auth, onlyAdmin, async (req, res) => {
  const { username, password, legajo } = req.body

  if (!username || !password || !legajo) {
    return res.status(400).json({ msg: 'Faltan datos' })
  }

  try {
    const existe = await User.findOne({ username })
    if (existe) return res.status(400).json({ msg: 'Usuario ya existe' })

    const hashed = await bcrypt.hash(password, 10)
    const nuevo = new User({ username, password: hashed, legajo })
    await nuevo.save()
    res.status(201).json({ msg: 'Usuario creado' })
  } catch {
    res.status(500).json({ msg: 'Error al crear usuario' })
  }
})

router.delete('/delete', auth, onlyAdmin, async (req, res) => {
  const { legajo } = req.query

  try {
    const eliminado = await User.findOneAndDelete({ legajo })
    if (!eliminado) {
      return res.status(404).json({ msg: 'Usuario no encontrado con ese legajo' })
    }

    res.json({ msg: 'Usuario eliminado exitosamente' })
  } catch {
    res.status(500).json({ msg: 'Error al eliminar usuario' })
  }
})

router.get('/me', auth, async (req, res) => {
  res.json({ username: req.user.username })
})

router.get('/all', auth, onlyAdmin, async (req, res) => {
  const q = req.query.q?.toUpperCase() || ''
  try {
    const resultados = await User.find({
      $or: [
        { username: { $regex: q } },
        { legajo: { $regex: q } }
      ]
    }).select('-password')
    res.json(resultados)
  } catch {
    res.status(500).json({ msg: 'Error en la búsqueda' })
  }
})

router.delete('/:id', auth, onlyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Usuario eliminado' })
  } catch {
    res.status(500).json({ msg: 'Error al eliminar usuario' })
  }
})


module.exports = router
