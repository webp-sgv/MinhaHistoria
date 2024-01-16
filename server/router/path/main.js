const express = require('express');
const router = express.Router();

router.get('/path/create/user', (req, res) => {
    const { nome } = req.body;
});