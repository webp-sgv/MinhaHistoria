const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home/index.html');
});

module.exports = router;