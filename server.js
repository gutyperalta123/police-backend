require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const userRoutes = require('./routes/user')
const objectRoutes = require('./routes/objects')
const User = require('./models/User')

const app = express()

app.use(cors({
  origin: ['https://police-frontend.onrender.com', 'http://localhost:5173']
}))
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/objects', objectRoutes)

app.get('/', (req, res) => {
  res.send('Servidor backend de la Aplicación Policial activo')
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB')

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })

    crearAdmin()
  })
  .catch(err => console.error('Error al conectar a MongoDB', err))

async function crearAdmin() {
  const existe = await User.findOne({ username: 'GUSTAVOPERALTA' })
  if (!existe) {
    const hashed = await bcrypt.hash('admin123', 10)
    const nuevo = new User({
      username: 'GUSTAVOPERALTA',
      password: hashed,
      legajo: '0001'
    })
    await nuevo.save()
    console.log('Administrador creado: GUSTAVOPERALTA / admin123 / legajo 0001')
  }
}
