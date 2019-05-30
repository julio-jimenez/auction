const express = require('express');

const router = express.Router();
const responseWraper = require('../middlewares/wraper');
const handler = require('../middlewares/handlers');
require('dotenv').config();
const mongoose = require('mongoose');

router.get('/log/:id', async (req, res) => {
      handler.getLog(req.params.id).then((resp) => {
        if (!resp) { res.status(404).send(responseWraper({ error: 'Record not found' }, res.statusCode, req)); } else { res.send(responseWraper(resp, res.statusCode, req)); }
      }).catch((err) => {
        res.status('400').send(responseWraper(err, res.statusCode, req));
      });
  });
  
  router.get('/logs', async (req, res) => {
    handler.getLogs(req.query).then((resp) => {
      if (!resp) { res.status(404).send(responseWraper({ error: 'Records not found' }, res.statusCode, req)); } else { res.send(responseWraper(resp, res.statusCode, req)); }
    }).catch((err) => {
      res.status('400').send(responseWraper(err, res.statusCode, req));
    });
  });
  
module.exports = router;
