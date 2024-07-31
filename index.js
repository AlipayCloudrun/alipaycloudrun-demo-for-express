const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const log4js = require('./util/log_util');
const commonUtil = require('./util/common_util');
const recordModel = require('./db/record_model');
const RedisClient = require('./redis/redis');
const ElasticScalingService = require('./elasticScale/ElasticScalingService');
const app = express();
const elasticScalingService = new ElasticScalingService();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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
  let version = process.env.PUB_SERVICE_REVISION == undefined ? 'express-demo' : process.env.PUB_SERVICE_REVISION;
  let hostName = process.env.HOSTNAME == undefined ? 'express-demo' : process.env.HOSTNAME;
  let result = '欢迎使用云托管!&服务版本：' + version + '&实例主机：' + hostName;
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

//弹性伸缩cpu更改
app.get('/elastic/scaling/cpu/update', async (req, res) => {
  try {
    const percentage = parseInt(req.query.percentage, 10);
    if (isNaN(percentage) || percentage < 0 || percentage > 80) {
      return res.status(400).json({ code: 'ELASTIC_SCALE_PARAM_ERROR', message: 'Parameter error' });
    }
    await elasticScalingService.cpuClean();
    await elasticScalingService.cpuUpdate(percentage);
    res.status(200).json({ code: 'SUCCESS', message: 'success' });
  } catch (e) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: e.message });
  }
});

//弹性伸缩cpu清理
app.get('/elastic/scaling/cpu/clean', async (req, res) => {
  await elasticScalingService.cpuClean();
  res.status(200).send('CPU cleaned');
});

//弹性伸缩cpu使用率获取
app.get('/elastic/scaling/cpu/get', async (req, res) => {
  await elasticScalingService.getCpu();
  res.status(200).send('CPU load retrieved');
});


const port = process.env.PORT || 80;

async function bootstrap() {
  app.listen(port, () => {
    log4js.getLogger().info("启动成功", port);
  });
}

bootstrap();
