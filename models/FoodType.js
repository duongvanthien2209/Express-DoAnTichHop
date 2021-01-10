const mongoose = require('mongoose');

const FoodTypeSchema = new mongoose.Schema({
  tenLoai: {
    type: String,
    required: true,
  },
});

const FoodType = mongoose.model('FoodType', FoodTypeSchema, 'foodTypes');

module.exports = FoodType;
