const Product = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: '../../uploads'});

const getIndex = async (req, res) => {
  const { name } = req.query;
  try {
    const products = await Product.findAll();
    res.send(products);
  } catch (err) {
    res.send(err);
  }
}

const getView = async (req, res) => {
  const productsId = req.params.id;

  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      res.send(product);
    } else {
      res.status(404).json({
        message: 'Product not found'
      });
    }
  } catch (err) {
    res.send(err);
  }
}

const storePost = async (req, res) => {
  const {users_id, name, price, stock, status} = req.body;
  console.log(req.body);
  const image = req.file;
  console.log(req.file);
  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    try{
      await Product.sync();
      const result = await Product.create({users_id, name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`});
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  } else {
    res.json({
      msg: 'Failed'
    })
  }
}

module.exports = {
  getIndex,
  getView,
  storePost
}