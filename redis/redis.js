const redis = require('redis')
var logger = require('../util/log_util')
const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, } = process.env;
module.exports.set = async function (key, value, res) {
    try {

        const client = redis.createClient({

            socket: {
                port: REDIS_PORT,
                host: REDIS_HOST,
            },
            password: REDIS_PASSWORD,
            legacyMode: true,

        });

        await client.connect();

        logger.getLogger().info("connected");

        await client.v4.set(key, value,function(err){
            if (err) {
                logger.getLogger("ERROR-LOGGER").error('set err');
                logger.getLogger("ERROR-LOGGER").error(err);
                logger.getLogger("ERROR-LOGGER").error('set err after');
            }
        });
        res.send(true);


    } catch (err) {

        logger.getLogger("ERROR-LOGGER").error(err);
        res.send(false);
    }
    return true;
}

module.exports.get = async function (key, res) {
    try {

        const client = redis.createClient({

            socket: {
                port: REDIS_PORT,
                host: REDIS_HOST,
            },
            password: REDIS_PASSWORD,
            legacyMode: true,
        });

        await client.connect();

        logger.getLogger().info("connected");

        await client.get(key, function (err, v) {

            if (err) {
                logger.getLogger("ERROR-LOGGER").error(err);
            }
            logger.getLogger().info("redis get err,v", err, v);
            if (v === null) {
                v = 'nil';
            }
            res.send(v);

        });
    } catch (err) {
        res.send(false);
        logger.getLogger("ERROR-LOGGER").error(err);

    }
}
