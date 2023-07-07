const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: '../../uploads'});
const productController = require('./controller');

router.post('/product', upload.single ('image'), productController.storePost);

module.exports = router;