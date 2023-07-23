const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const fs = require('fs');
const path = require('path');
const productController = require('./controller');

router.get ('/product', productController.getIndex);
router.get ('/product/:id', productController.getView);
router.post('/product', upload.single('image'), productController.storePost);
router.put('/product/:id', upload.single('image'),productController.putUpdate);
router.delete('/product/:id', productController.deleteProductByid);
router.delete('/product/delete/:name', productController.deleteProductByname);

module.exports = router;