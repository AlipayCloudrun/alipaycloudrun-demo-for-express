var mysql = require('mysql');
var dbconfig = require("./database");
var commonUtil = require('../util/common_util')
var logger = require('../util/log_util')


//使用连接池,
var pool = mysql.createPool(dbconfig.database);

const result = {
  success: null,
  data: null,
  errorCode: null,
  errorMessage: null
}


module.exports = {
  getList: (req, res) => {
    pool.getConnection(function (err, connection) {
      let begin = Date.now();
      if (err) {
        logger.getLogger("ERROR-LOGGER").error(err);
        resultData = JSON.stringify(commonUtil.dbAccessError());
        logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, false));
        return res.send(resultData);
      } else {
        // 查询语句
        let sql = 'select id,gmt_create,gmt_modified,record from record_info order by id desc limit 10';
        // 执行查询语句
        connection.query(sql, (err, resultData) => {
          if (err) {
            logger.getLogger("ERROR-LOGGER").error(err);
            resultData = JSON.stringify(commonUtil.dbAccessError());
            logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, false));
            res.send(resultData);
          } else {
            result.success = true;
            result.data = resultData;
            resultData = JSON.stringify(result);
            logger.getLogger("DAL-LOGGER").info(commonUtil.printLog(req, Date.now() - begin, true));
            res.send(resultData);
            // 释放连接
            connection.release();
          }
        })
      }
    })
    return true;
  },
  addRecord: (req, res) => {
    pool.getConnection(function (err, connection) {
      let begin = Date.now();
      if (err) {
        logger.getLogger("ERROR-LOGGER").error(err);
        resultData = JSON.stringify(commonUtil.dbAccessError());
        logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, false));
        res.send(resultData);
      } else {
        // 插入语句
        let addSql = 'insert into record_info (record) values (?)';

        let sqlParams = [req.body.record];
        // 执行插入语句
        connection.query(addSql, sqlParams, (err, resultData) => {
          if (err) {
            logger.getLogger("ERROR-LOGGER").error(err);
            resultData = JSON.stringify(commonUtil.dbAccessError());
            logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, false));
            res.send(resultData);
          } else {
            result.success = true;
            result.data = resultData;
            resultData = JSON.stringify(result);
            logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, true));
            res.send(resultData);
            // 释放连接
            connection.release();
          }
        })
      }
    })
    return true;
  },
  deleteRecord: (req, res) => {
    pool.getConnection(function (err, connection) {
      let begin = Date.now();
      if (err) {
        logger.getLogger("ERROR-LOGGER").error(err);
        resultData = JSON.stringify(commonUtil.dbAccessError());
        logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, false));
        res.send(resultData);
      } else {
        // 删除语句
        let deleteSql = 'delete from record_info where id = ?';

        let sqlParam = req.query.id;
        // 执行删除语句
        connection.query(deleteSql, sqlParam, (err, resultData) => {
          if (err) {
            logger.getLogger("ERROR-LOGGER").error(err);
            resultData = JSON.stringify(dbAccessError.dbAccessError());
            logger.getLogger("DAL-LOGGER").info(commonUtil.printPostLog(req, Date.now() - begin, false));
            res.send(resultData);
          } else {
            result.success = true;
            result.data = resultData;
            resultData = JSON.stringify(result);
            logger.getLogger("DAL-LOGGER").info(commonUtil.printLog(req, Date.now() - begin, true));
            res.send(resultData);
            // 释放连接
            connection.release();
          }
        })
      }
    })
  }
}