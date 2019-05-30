const express = require('express');

const router = express.Router();
const responseWraper = require('../middlewares/wraper');
const handler = require('../middlewares/handlers');
require('dotenv').config();
const mongoose = require('mongoose');


router.post('/bid', async (req, res) => {
    if (!req.body.amount || !req.body.email || !req.body.auctionId) res.status('400').send(responseWraper('Missing required property', res.statusCode, req))
  handler.newBid(req.body).then((resp) => {
    res.send(responseWraper(resp, res.statusCode, req));
  })
    .catch((err) => {
      console.error(err);
      res.status('400').send(responseWraper(err, res.statusCode, req));
    });
});

router.post('/auction', async (req, res) => {
    if (!req.body.description || !req.body.startingPrice || !req.body.email || !req.body.item) res.status('400').send(responseWraper('Missing required property', res.statusCode, req));
  handler.newAuction(req.body).then((resp) => {
    res.send(responseWraper(resp, res.statusCode, req));
  }).catch((err) => {
    res.status('400').send(responseWraper(err, res.statusCode, req));
  });
});

router.get('/auction/:id', async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    handler.getAuction(req.params.id).then((resp) => {
      if (!resp) { res.status(404).send(responseWraper({ error: 'Record not found' }, res.statusCode, req)); } else { res.send(responseWraper(resp, res.statusCode, req)); }
    }).catch((err) => {
      res.status('400').send(responseWraper(err, res.statusCode, req));
    });
  } else { return res.status(404).send('Invalid ID'); }
});

router.get('/auctions', async (req, res) => {
  handler.getAuctions(req.query).then((resp) => {
    if (!resp) { res.status(404).send(responseWraper({ error: 'Records not found' }, res.statusCode, req)); } else { res.send(responseWraper(resp, res.statusCode, req)); }
  }).catch((err) => {
      res.status('400').send(responseWraper(err, res.statusCode, req));
  });
});

router.get('/bid/:id', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      handler.getBid(req.params.id).then((resp) => {
        if (!resp) { res.status(404).send(responseWraper({ error: 'Record not found' }, res.statusCode, req)); } else { res.send(responseWraper(resp, res.statusCode, req)); }
      }).catch((err) => {
        res.status('400').send(responseWraper(err, res.statusCode, req));
      });
    } else { return res.status(404).send('Invalid ID'); }
  });
  
  router.get('/bids', async (req, res) => {
    handler.getBids(req.query).then((resp) => {
      if (!resp) { res.status(404).send(responseWraper({ error: 'Records not found' }, res.statusCode, req)); } else { res.send(responseWraper(resp, res.statusCode, req)); }
    }).catch((err) => {
      res.status('400').send(responseWraper(err, res.statusCode, req));
    });
  });
  
router.post('/auction/:id/start', async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    handler.startAuction(req.params.id).then((resp) => {
      res.send(responseWraper(resp, res.statusCode, req));
    }).catch((err) => {
      res.status('400').send(responseWraper(err, res.statusCode, req));
    });
  } else { return res.status(404).send('Invalid ID'); }
});

router.post('/auction/:id/stop', async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    handler.stopAuction(req.params.id).then((resp) => {
      res.send(responseWraper(resp, res.statusCode, req));
    }).catch((err) => {
      res.status('400').send(responseWraper(err, res.statusCode, req));
    });
  } else { return res.status('400').send(responseWraper({ error: 'Invalid ID' }, res.statusCode, req)); }
});

module.exports = router;
