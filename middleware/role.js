function onlyAdmin(req, res, next) {
  if (req.user.username !== 'GUSTAVOPERALTA') {
    return res.status(403).json({ msg: 'Solo el administrador puede realizar esta acción' })
  }
  next()
}

module.exports = { onlyAdmin }
