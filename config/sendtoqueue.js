const Channel = require('../config/channel');

const queue = 'queue';

module.exports = function send(body) {
  Channel(queue, async (err, channel, conn) => {
    if (err) {
      console.error(err.stack);
    } else {
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(body)), {
        persistent: true,
      });
      setImmediate(() => {
        channel.close();
        conn.close();
      });
    }
  });
};
