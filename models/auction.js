const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 20,
};


// Define a schema
const { Schema } = mongoose;

const auctionSchema = new Schema({
  item: String,
  description: String,
  email: String,
  startingPrice: Number,
  status: {
    type: String,
    enum: ['waiting', 'ongoing', 'finished'],
  },
  winningBid: Schema.Types.ObjectId,
  startTime: Date,
  endTime: Date,
});

auctionSchema.plugin(mongoosePaginate);
const auction = mongoose.model('auction', auctionSchema);
module.exports = auction;
