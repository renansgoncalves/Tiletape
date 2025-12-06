const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    const fileName = req.query.name;
    if (!fileName) return res.status(400).send('Nome da playlist não fornecido.');
    const filePath = path.join(__dirname, '../', `${fileName}.png`);
    res.download(filePath, `${fileName}.png`);
});

module.exports = router;
