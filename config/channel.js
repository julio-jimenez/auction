const amqp = require('amqplib/callback_api');

module.exports = createQueueChannel;

const url = process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672';
function createQueueChannel(queue, cb) {
  amqp.connect(url, onceConnected);
  function onceConnected(err, conn) {
    if (err) {
      console.error(err);
    } else {
      conn.createConfirmChannel(onceChannelCreated);
    }
    function onceChannelCreated(err, channel) {
      if (err) {
        cb(err);
      } else {
        channel.assertQueue(queue, { durable: true }, onceQueueCreated);
      }

      function onceQueueCreated(err) {
        if (err) {
          cb(err);
        } else {
          cb(null, channel, conn);
        }
      }
    }
  }
}
