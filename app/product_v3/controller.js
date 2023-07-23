const { ObjectId } = require('mongodb');
const db = require('../../config/mongodb');
const fs = require('fs');
const path = require('path');

const getIndex = (req, res) => {
  const { name } = req.query;
  const searchName = { name: { $regex: name, $options: 'i' } };

  if (name) {
    db.collection('products')
      .findOne(searchName)
      .then((result) => {
        if (!result) {
          res.status(404).send({ status: 'failed', message: 'Product by name not found' });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((error) => res.send(error));
  } else {
    db.collection('products')
      .find()
      .toArray()
      .then((result) => res.status(200).send(result))
      .catch((error) => res.send(error));
  }
};

const getView = (req, res) => {
  const { id } = req.params;

  db.collection('products')
    .findOne({ _id: new ObjectId(id) })
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
  
  if (!name || name.trim() === '') {
    res.status(400).send({ status: 'failed', message: 'This field name is not complete' });
  } else if (!price || isNaN(price)) {
    res.status(400).send({ status: 'failed', message: 'This field price is not complete or invalid' });
  } else if (!stock || isNaN(stock)) {
    res.status(400).send({ status: 'failed', message: 'This field stock is not complete or invalid' });
  } else if (typeof status !== 'boolean' || status === null || status === undefined) {
    res.status(400).send({ status: 'failed', message: 'This field status must be a boolean and cannot be empty' });
  } else {
    let productData = { name, price, stock, status };

    if (image) {
      const target = path.join(__dirname, '../../uploads', image.originalname);
      fs.renameSync(image.path, target);
      productData.image_url = `http://localhost:3000/public/${image.originalname}`;
    }

    db.collection('products')
      .insertOne(productData)
      .then((result) => res.status(201).send(result))
      .catch((error) => res.send(error));
  }
};

const putUpdate = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;

  let productData = { name, price, stock, status };

  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    productData.image_url = `http://localhost:3000/public/${image.originalname}`;
  }

  db.collection('products')
    .updateOne({ _id: new ObjectId(id) }, { $set: productData })
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

  db.collection('products')
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      if (result) {
        res.status(200).send({ status: 'success', message: 'Product by id deleted successfully' });
      } else {
        res.status(404).send({ status: 'failed', message: 'Product by id failed to delete' });
      }
    })
    .catch((error) => res.send(error));
};

const deleteProductByname = (req, res) => {
  const { name } = req.params;
  const deleteName = { name: { $regex: name, $options: 'i' } }

  db.collection('products')
    .deleteOne(deleteName)
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