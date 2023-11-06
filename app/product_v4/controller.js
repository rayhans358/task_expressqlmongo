const Product = require('./model');
const path = require('path');
const fs = require('fs');

const getIndex = (req, res) => {
  const { name } = req.query;

  if (name) {
    Product.findOne({ name: { $regex: name, $options: 'i' } }) // we can use this in mongoose with Model.findOne() to search by name and using regex in Mongoose to find items
      .then((result) => {
        if (!result) {
          res.status(404).send({ status: 'failed', message: 'Product by name not found' });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((error) => res.send(error));
  } else {
    Product.find()
      .then((result) => res.status(200).send(result))
      .catch((error) => res.send(error));
  }
};

const getView = (req, res) => {
  const { id } = req.params;

  Product.findById(id) // we can use this in mongoose with Model.findById() to search by id
    .then((result) => {
      if (!result) {
        res.status(404).send({ status: 'failed', message: 'Product by _id not found' });
      } else {
        res.status(200).send(result);
      }
    })
    .catch((error) => res.send(error));
};

const storePost = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (!name) {
    return res.status(400).send({ status: 'failed', message: 'This field name is not complete' });
  }
  if (!price || isNaN(price)) {
    return res.status(400).send({ status: 'failed', message: 'This field price is not complete or invalid' });
  }
  if (!stock || isNaN(stock)) {
    return res.status(400).send({ status: 'failed', message: 'This field stock is not complete or invalid' });
  }
  if (!status || status === null || status === undefined) {
    return res.status(400).send({ status: 'failed', message: 'This field status must cannot be empty or null and undefined' });
  }
  
  let imageUrl = '';
  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    imageUrl = `http://localhost:3000/public/${image.originalname}`;
  }
  
  const productData = {
    name,
    price,
    stock,
    status,
   };
  
  if (imageUrl) {
    productData.image_url = imageUrl;
  }
  
  Product.create(productData) // we can use this in mongoose with Model.create() to create productData
    .then((result) => res.status(201).send(result))
    .catch((error) => res.send(error));
};

const putUpdate = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;

  let imageUrl = '';
  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    imageUrl = `http://localhost:3000/public/${image.originalname}`;
  }

  const productData = {
    name,
    price,
    stock,
    status,
  };

  if (imageUrl) {
    productData.image_url = imageUrl;
  }
  Product.findByIdAndUpdate(id, productData, { new: true }) // we can use this Model.findByIdAndUpdate() to search for data by _id and update the data
    .then((result) => {
      if (result) {
        res.status(200).send({ status: 'success', message: 'Product updated successfully' });
      } else {
        res.status(404).send({ status: 'failed', message: 'Product failed to update' });
      }
    })
    .catch((error) => res.send(error))
};

const deleteProductByid = (req, res) => {
  const { id } = req.params;

  Product.findByIdAndDelete(id) // we can use this Model.findByIdAndDelete() to delete data based on _id
    .then((result) => {
      if (result) {
        res.status(200).send({ status: 'success', message: 'Product by _id deleted successfully' });
      } else {
          res.status(404).send({ status: 'failed', message: 'Product by _id failed to delete' });
      }
    })
    .catch((error) => res.send(error));
};

const deleteProductByname = (req, res) => {
  const { name } = req.params;
  const deleteName = { name: { $regex: name, $options: 'i' } }

  Product.deleteOne(deleteName) // we can use this Model.deleteOne() to delete data based on deleteName condition
    .then((result) => {
      if (result) {
        res.status(200).send({ status: 'success', message: 'Product by name deleted successfully' });
      } else {
        res.status(404).send({ status: 'failed', message: 'Product by name failed to delete' });
      }
    })
    .catch((error) => res.send(error));
};

module.exports = {
  getIndex,
  getView,
  storePost,
  putUpdate,
  deleteProductByid,
  deleteProductByname
}