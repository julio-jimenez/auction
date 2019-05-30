const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const auction = require('./auction');
const bid = require('./bid');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20,
};

// Define a schema
const { Schema } = mongoose;

const Response = new Schema({
    _id: false,
    status: Number
})

const RequestBody = new Schema({
    _id: false,
    item: String,
    description: String,
    host: String,
    email: String,
    startingPrice: Number,
    amount: Number,
    auctionId: Schema.Types.ObjectId
})

const Request = new Schema({
    _id: false,
    path: String,
    host: String,
    method: String,
    body: RequestBody
})

const logAuctionSchema = new Schema({
    _id: String,
    response: Response,
    request: Request,
    time: Date
});

logAuctionSchema.plugin(mongoosePaginate);

const log = mongoose.model('log', logAuctionSchema);
const request = mongoose.model('request', Request);
const requestBody = mongoose.model('requestBody', RequestBody);
const response = mongoose.model('response', Response);


module.exports = { log, request, requestBody, response };
