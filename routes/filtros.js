const router = require('express').Router();
const {
	getFiltros
} = require('../controllers/filtros');


router.get('/', getFiltros);

module.exports = router;