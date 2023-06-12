 const express = require('express')
 const router = express.Router()

 const PensamentoController = require('../controllers/PensamentoController')

 // Helpers
 const checkAuth = require('../helpers/auth').checkAuth


 router.get('/add', checkAuth, PensamentoController.createPensamento)
 router.post('/add', checkAuth, PensamentoController.createPensamentoSave)
 router.get('/edit/:id', checkAuth, PensamentoController.updatePensamento)
 router.post('/edit', checkAuth, PensamentoController.updatePensamentoSave)

 router.post('/remove', checkAuth, PensamentoController.removePensamento)
 router.get('/dashboard', checkAuth, PensamentoController.dashboard)
 router.get('/', PensamentoController.showPensamentos)

 module.exports = router