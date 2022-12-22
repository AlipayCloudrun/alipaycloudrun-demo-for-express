// 从环境变量中读取数据库配置
const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST = "",DATABASE_NAME,} = process.env;

const [host, port] = DATABASE_HOST.split(":");

// 连接mysql
const config = {
  database: {
    host: host,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: port,
    database: DATABASE_NAME,
    dateStrings: true
  }
};

// 导出初始化方法和模型
module.exports = config
