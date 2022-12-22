const path = require("path");
const express = require("express");
const cors = require("cors");
const log4js = require('./util/log_util');
const commonUtil = require('./util/common_util');
const recordModel = require('./db/record_model');
const RedisClient = require('./redis/redis');
const moment = require('moment');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));


// 首页
app.get("/", async (req, res) => {
  let begin = Date.now();
  res.sendFile(path.join(__dirname, "index.html"));
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printLog(req, Date.now() - begin, true));
});

// 服务访问
app.get("/service", async (req, res) => {
  let begin = Date.now();
  let result = '欢迎使用云托管!服务版本：' + process.env.PUB_SERVICE_REVISION + '\n实例主机：' + process.env.HOSTNAME + '\n当前时间：' + moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  res.send(result);
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printLog(req, Date.now() - begin, true));
});

// 查看记录信息
app.get("/database/getList", async (req, res) => {
  let begin = Date.now();
  const result = recordModel.getList(req, res);
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printLog(req, Date.now() - begin, result));
});



// 新增记录
app.post("/database/addRecord", async (req, res) => {
  let begin = Date.now();
  const result = recordModel.addRecord(req, res);
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printPostLog(req, Date.now() - begin, result));
});


//删除记录
app.get("/database/deleteRecord", async (req, res) => {
  let begin = Date.now();
  const result = recordModel.deleteRecord(req, res);
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printLog(req, Date.now() - begin, result));
});


// 缓存赋值服务
app.get("/redis/set", async (req, res) => {
  let begin = Date.now();
  await RedisClient.set(req.query.key, req.query.value, res);
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printLog(req, Date.now() - begin, true));
});

//缓存取值服务
app.get("/redis/get", async (req, res) => {
  let begin = Date.now();
  await RedisClient.get(req.query.key, res);
  const logger = log4js.getLogger('MVC-LOGGER');
  logger.info(commonUtil.printLog(req, Date.now() - begin, true));
});


const port = process.env.PORT | 80;

async function bootstrap() {
  app.listen(port, () => {
    log4js.getLogger().info("启动成功", port);
  });
}

bootstrap();
