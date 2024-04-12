const express = require('express')
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

router.post('/register',userController.register)

router.post('/login',userController.login)

router.get('/records',verifyToken,userController.records)

router.post('/add',verifyToken,userController.add)

router.post('/delete',verifyToken,userController.delete)

router.post('/edit',verifyToken,userController.edit)

router.post('/addhostingzone',verifyToken,userController.hostingZone)

router.post('/viewhostingzone',verifyToken,userController.view)

module.exports = router