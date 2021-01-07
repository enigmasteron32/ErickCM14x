const router = require('express').Router();
const {
	getIdr,
    postIdr,
    putIdr,
    validateToken
} = require('../controllers/idr');

const auth = require('./auth')

router.get('/', auth.requerido, getIdr);
router.get('/:id', auth.requerido, getIdr);
router.post('/', postIdr);
router.put('/:id', auth.requerido, putIdr);
router.get('/validate', auth.requerido, validateToken)

module.exports = router;