const client = require('../utils/db')

client.on('error', function(err){ console.log('Something went wrong ', err) })

module.exports = {
    set, del, stop, get,
};

async function set(data) {
    client.set(data._id.toString(), data.endTime, (err) => {
        if (err) { throw err; }
    });
}

async function del(data) {
    client.del(data, (err) => {
        if (err) { throw err; }
    });
}

async function stop(data) {
    client.set(data._id.toString(), 'stop', (err) => {
        if (err) { throw err; }
    });
}

async function get(data, cb) {
    client.get(data, (err, resp) => {
        if (err) { throw err; }
        cb(resp);
    });
}
