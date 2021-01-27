const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  chiTiet: String,
  // nhaHang: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Restaurant',
  //   required: true,
  // },
  monAn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  khachHang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model('Comment', CommentSchema, 'comments');
module.exports = Comment;
