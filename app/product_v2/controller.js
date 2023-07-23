const Product = require('./model');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

const getIndex = async (req, res) => {
  const { name } = req.query;

  try {
    let products;
    if (name) {
      // This is shorter, and less error prone because it still works if you add / remove attributes from your model later
      products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%` // LIKE '%hat'
          }
        }
      }); // SELECT * FROM get WHERE name = query;
    } else {
      products = await Product.findAll();
    }

    if (products.length > 0) {
      res.status(200).send(products);
    } else {
      res.status(404).json({
        message: 'Product not found'
      });
    }
  } catch (err) {
    res.send(err);
  }
}

const getView = async (req, res) => {
  const productsId = req.params.id;

  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      res.status(200).send(product);
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
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  
  try {
    if (!users_id || !name || !price || !stock || !status) {
      //apabila data kurang lengkap maka err
      res.status(404).json({
        message: 'Product is not complete'
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
        res.status(201).send(result);
      } else {
        //apabila image tidak tersedia maka juga bisa di post
        await Product.sync();
        const result = await Product.create({
          users_id,
          name,
          price,
          stock,
          status
        });
        res.status(201).send(result);
      }
    }
  } catch (err) {
    res.send(err);
  }
}

const putUpdate = async (req, res) => {
  const productsId = req.params.id;
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;

  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        await product.update({
          users_id,
          name,
          price,
          stock,
          status,
          image_url: `http://localhost:3000/public/${image.originalname}`
        });
      } else {
        await product.update({
          users_id,
          name,
          price,
          stock,
          status
        });
      }
      res.status(200).send(product);
    } else {
      res.status(404).json({
        message: 'Product failed to update'
      });
    }
  } catch (err) {
    res.send(err);
  }
}

const deleteProductByid = async (req, res) => {
  const productsId = req.params.id;
  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      await product.destroy();
      res.status(200).json({
        message: 'Product by id deleted successfully'
      });
    } else {
      res.status(404).json({
        message: 'Product by id failed to delete'
      });
    }
  } catch (err) {
    res.send(err);
  }
}

const deleteProductByname = async (req, res) => {
  const productsName = req.params.name;
  try {
    const product = await Product.findOne({
      where: {
        name: {
          [Op.like]: `%${productsName}%` // LIKE '%hat'
        }
      }
    });
    console.log(product, '165');
    if (product) {
      await product.destroy();
      res.status(200).json({
        message: 'Product by name deleted successfully'
      });
    } else {
      res.status(404).json({
        message: 'Product by name failed to delete'
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
  storePost,
  deleteProductByid,
  deleteProductByname
}