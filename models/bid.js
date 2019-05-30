const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 20,
};

// Define a schema
const { Schema } = mongoose;

const bidSchema = new Schema({
  email: String,
  amount: Number,
  bidId: Schema.Types.ObjectId, // auctionId
});
bidSchema.plugin(mongoosePaginate);

const bid = mongoose.model('bid', bidSchema);

module.exports = bid;
