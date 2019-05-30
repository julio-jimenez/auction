const Channel = require('../config/channel');
const handler = require('../middlewares/handlers')
const redis = require('./redis')

function start(data) {
    try {
        Channel(data, function (err, channel, conn) {
            if (err) {
                console.error(err.stack);
            }
            else {
                consume();
            }
            function consume() {
                try {
                    channel.get(data, {}, onConsume);
                }
                catch {
                    setTimeout(function () {
                        start('queue')
                    }, 10e3);
                }

                function onConsume(err, msg) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else if (msg) {
                        const process = JSON.parse(msg.content.toString())
                        if (process.status == "ongoing") {
                            redis.get(process._id.toString(), check => {
                                if (check === 'stop') {
                                    redis.del(process._id.toString())
                                    channel.ack(msg)
                                    process.status = 'stopped'
                                    try { consume() }
                                    catch { setTimeout(function () { start('queue') }, 10e3) }
                                }

                                else if (new Date(process.endTime) - Date.now() <= 0 && process.status === 'ongoing') {
                                    handler.autoStop(process)
                                    redis.del(process._id.toString())
                                    channel.ack(msg)

                                    setTimeout(function () {
                                        try { consume() }
                                        catch { setTimeout(function () { start('queue') }, 10e3) }
                                    }, 1e3)
                                }
                                else if (process.status === 'ongoing' && check != 'stop') {
                                    setTimeout(function () {
                                        try { onConsume(NaN, msg) }
                                        catch { setTimeout(function () { start('queue') }, 10e3) }
                                    }, 1e3)
                                }
                                else {
                                    try { consume() }
                                    catch { setTimeout(function () { start('queue') }, 10e3) }
                                }
                            })
                        }
                        else {
                            consume()
                        }
                    }
                    else {
                        consume()
                    }
                }
            }
        })

    }
    catch {
        start('queue')
    }
}
start('queue')

