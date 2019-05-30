const mongoose = require('mongoose');
const auction = require('../models/auction');
const bid = require('../models/bid');
const log = require('../models/log');
const queue = require('../config/sendtoqueue');
const redis = require('../config/redis');


module.exports = {
  newBid,
  stopAuction,
  startAuction,
  newAuction,
  getAuction,
  getAuctions,
  autoStop,
  getBid,
  getBids,
  getLog,
  getLogs
};

async function newBid(data) {
  let response = '';
  let bidId = '';
  let verificationBid = '';
  let verificationAuction = '';

  await auction.findById(data.auctionId).then(async (resp) => {
    verificationAuction = resp;
  }).catch((err) => {
    throw err;
  });
  if (verificationAuction == null) return 'Auction does not exist';

  if (verificationAuction != null && verificationAuction.winningBid) {
    verificationBid = await bid.findById(verificationAuction.winningBid).then(resp => resp.amount).catch((err) => {
      throw err;
    });
  }

  switch (verificationAuction.status) {
    case 'finished':
      return 'Auction finished';
    case 'waiting':
      return 'Auction has not started';
  }
  if (verificationAuction.startingPrice > data.amount || verificationBid >= data.amount) {
    return 'Amount must be higher than current bid';
  }

  const nBid = new bid({
    amount: data.amount,
    email: data.email,
    auctionId: data.auctionId,
  });
  await nBid.save().then((resp) => {
    bidId = resp._id;
  }).catch((err) => {
    throw err;
  });

  await auction.findByIdAndUpdate(data.auctionId, {
    winningBid: bidId,
  }, { new: true }).then((save) => {
    response = save;
  }).catch((err) => {
    throw err;
  });
  return response;
}

async function autoStop(data) {
  const verification = await auction.findById(data);
  if (verification.status == 'finished') { return 'Already stopped'; }
  await auction.findByIdAndUpdate(data, {
    status: 'finished',
  }).catch((err) => { throw err; });
}

async function stopAuction(data) {
  let response = '';
  const verification = await auction.findById(data);
  if (verification.status == 'finished') { return 'Already stopped'; }
  await auction.findByIdAndUpdate(data, {
    status: 'finished',
    endTime: Date.now(),
  }, { new: true }).then(async (save) => {
    redis.stop(save);
    response = await save;
  }).catch((err) => {
    throw err;
  });
  return response;
}

async function startAuction(data) {
  let response = '';
  const verification = await auction.findById(data);
  if (verification.status == 'ongoing') { return 'Already started'; }
  if (verification.status == 'finished') { return 'Auction has finished'; }
  const newDate = Date.now();
  await auction.findByIdAndUpdate(data, {
    status: 'ongoing',
    startTime: new Date(newDate).toLocaleString(),
    endTime: new Date(newDate + (60e3 * 30)).toLocaleString(), 
  }, { new: true }).then((save) => {
    queue(save);
    redis.set(save);
    response = save;
  }).catch((err) => {
    throw err;
  });
  return response;
}

async function newAuction(data) {
  let response = '';

  const newA = new auction({
    id: mongoose.Types.ObjectId.createFromTime(),
    item: data.item,
    description: data.description,
    email: data.email,
    startingPrice: data.startingPrice,
    status: 'waiting',
  });

  await newA.save().then((save) => {
    response = save;
  }).catch((err) => {
    throw err;
  });
  return response;
}

async function getAuction(data) {
  return auction.findById(data);
}

async function getAuctions(data) {
  let response = '';
  const options = {
    page: data.page,
    limit: data.limit,
  };
  if (options.page === undefined) {
    await auction.find({}).then((save) => {
      response = save;
    }).catch((err) => {
      throw err;
    });
  } else {
    if (options.limit == NaN || options.limit == undefined) { options.limit = 10; }
    await auction.paginate({}, options).then((save) => {
      response = save.docs;
    }).catch((err) => {
      throw err;
    });
  }
  return response;
}
async function getBid(data) {
    return bid.findById(data);
  }
  
  async function getBids(data) {
    let response = '';
    const options = {
      page: data.page,
      limit: data.limit,
    };
    if (options.page === undefined) {
      await bid.find({}).then((save) => {
        response = save;
      }).catch((err) => {
        throw err;
      });
    } else {
      if (options.limit == NaN || options.limit == undefined) { options.limit = 10; }
      await bid.paginate({}, options).then((save) => {
        response = save.docs;
      }).catch((err) => {
        throw err;
      });
    }
    return response;
  }

  async function getLog(data) {
    return log.log.findById(data);
  }
  
  async function getLogs(data) {
    let response = '';
    const options = {
      page: data.page,
      limit: data.limit,
    };
    if (options.page === undefined) {
      await log.log.find({}).then((save) => {
        response = save;
      }).catch((err) => {
        throw err;
      });
    } else {
      if (options.limit == NaN || options.limit == undefined) { options.limit = 10; }
      await log.log.paginate({}, options).then((save) => {
        response = save.docs;
      }).catch((err) => {
        throw err;
      });
    }
    return response;
  }
