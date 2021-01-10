/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const Restaurant = require('./models/Restaurant');
const RestaurantType = require('./models/RestaurantType');
const FoodType = require('./models/FoodType');

// const restaurant = {
//   tenNhaHang: '',
//   name: '',
//   email: '',
//   password: '',
//   isVerified: true,
//   SDT: '',
//   loaiHinh: '',
// };

// console.log(restaurant);

exports.add = async (
  tenNhaHang,
  name,
  email,
  password,
  SDT,
  loaiHinh,
  diaChi,
) => {
  const restaurantType = await RestaurantType.findById(loaiHinh);

  // Tạo ra salt mã hóa
  const salt = await bcrypt.genSalt(10);

  const restaurant = await Restaurant.create({
    tenNhaHang,
    name,
    email,
    diaChi,
    SDT,
    password: await bcrypt.hash(password, salt),
    loaiHinh: restaurantType._id,
    isVerified: true,
  });

  console.log(restaurant);
};

exports.add1 = async (tenLoai) => {
  await FoodType.create({ tenLoai });
};

// add(
//   'Bún Bò Hiến Hằng',
//   'bunBoHienHang',
//   'duongvanthien1@.gmail.com',
//   '12345678',
//   '0968971926',
//   '5ff48be1b17b99c8e9d08625',
//   '172 Núi Thành, Quận Hải Châu, Đà Nẵng',
// );
