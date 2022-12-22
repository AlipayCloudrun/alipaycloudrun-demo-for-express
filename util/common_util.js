module.exports.dbAccessError = function () {
  const result = {
    success: false,
    data: null,
    errorCode: "DATAACCESS_ERROE",
    errorMessage: "数据库异常,请检查db连接"
  }
  return result;
}

module.exports.printLog = function (req, rt, rs) {
  let logStr = "";
  logStr = process.pid + ',' + getUri(req.url) + ',' +
    rt + 'ms,' + getRs(rs) + ',' + getParams(req.query);
  return logStr;
}

module.exports.printPostLog = function (req, rt, rs) {
  let logStr = "";
  logStr = process.pid + ',' + getUri(req.url) + ',' +
    rt + 'ms,' + getRs(rs) + ',' + getParams(req.body);
  return logStr;
}


function getParams(obj) {
  if (obj === null || obj === undefined || JSON.stringify(obj) == '{}') {
    return "";
  }
  return JSON.stringify(obj);
}

function getUri(str) {
  let arr = str.split('?');
  return arr[0];
}


function getRs(res) {
  return res ? 'Y' : 'N';
}