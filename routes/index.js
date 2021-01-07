var router = require('express').Router();

router.get('/', (req, res) => {
	res.send('welcome to my api');
})

router.use('/usuarios', require('./usuarios'));
router.use('/idr', require('./idr'));
router.use('/filtro', require('./filtros'));

module.exports = router;