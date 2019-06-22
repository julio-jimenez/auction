require('dotenv').config();
const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const auctions = require('./routes/auctionRoutes');
const logs = require('./routes/logRoutes');
const responseWraper = require('./middlewares/wraper');

require('./utils/db');
require('./config/channel');
require('./config/queue');
require('./config/sendtoqueue');
require('./models/auction');

app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(compression());
app.use(auctions);
app.use(logs);



app.use(function(req, res) {
  res.status(404).send(responseWraper('Not Found',res.statusCode, req));

});


const port =  process.env.PORT || 3000;

const server = app.listen(port, () => {
  const host = server.address().address;
  const { port } = server.address();

  console.log('App listening at http://%s:%s', host, port);
});
