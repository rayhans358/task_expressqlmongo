const Product = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: '../../uploads'});

const getIndex = async (req, res) => {
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
      res.json({
        message: 'Product not found'
      });
    }
  } catch (err) {
    res.send(err);
  }
}

const storePost = async (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  
  try {
    if (!users_id || !name || !price || !stock || !status) {
      res.json({
        message: 'Product not complete'
      });
    } else {
      if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        
        await Product.sync();
        const result = await Product.create({
          users_id,
          name,
          price,
          stock,
          status,
          image_url: `http://localhost:3000/public/${image.originalname}`
        });
        
        res.send(result);
      } else { //apabila image tidak tersedia 
        await Product.sync();
        const result = await Product.create({
          users_id,
          name,
          price,
          stock,
          status
        });
        res.send(result);
      }
    }
  } catch (err) {
    res.send(err);
  }
}

const putUpdate = async (req, res) => {
  const productsId = req.params.id;
  const { name, price, stock, status } = req.body;
  const image = req.file;

  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        await product.update({
          name,
          price,
          stock,
          status,
          image_url: `http://localhost:3000/public/${image.originalname}`
        });
      } else {
        await product.update({
          name,
          price,
          stock,
          status
        });
      }
      res.send(product);
    } else {
      res.json({
        message: 'Product not found'
      });
    }
  } catch (err) {
    res.send(err);
  }
}

module.exports = {
  getIndex,
  getView,
  putUpdate,
  storePost
}