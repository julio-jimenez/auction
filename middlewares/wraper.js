const uuid = require('uuid/v1');
const log = require('../models/log');
const mongoose = require('mongoose')


module.exports = function responseWrapper(response, status, req) {
    const unix = Date.now()
    const time = Math.round(unix / 1000)
    const body = {
    Meta: {
      ahorita: time,
      blla: uuid(),
      status,
    },
    Result: response,
  };
  console.log(time)
  const res_log = new log.response({
    status: body.Meta.status
  })
  const req_body = new log.requestBody({
    item: req.body.item,
    description: req.body.description,
    host: req.body.host,
    email: req.body.email,
    startingPrice: req.body.startingPrice,
    amount: req.body.amount,
    auctionId: req.body.auctionId
  })

  const req_log = new log.request({
    path: req.url,
    host: req.hostname,
    method: req.method,
    body: req_body
  })
  const logging = new log.log({
      _id: body.Meta.requestId,
      response: res_log,
      request: req_log,
      time: unix
  })

  logging.save().then(resp => {
      console.log(resp)
  }).catch(err =>{
      console.error(err)
  })

  return body;
};
