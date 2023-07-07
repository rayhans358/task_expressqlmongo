const Product = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: '../../uploads'});

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
      message: 'Failed'
    })
  }
}

module.exports = {
  storePost
}