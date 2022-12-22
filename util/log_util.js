const log4js = require('log4js');

log4js.configure({
  appenders: {
    mvcAppender: {
      type: "file",
      filename: "./logs/mvc-digest.log",
      pattern: ".yyyy-MM-dd hh",
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p %c{2} - %m%n'
      }
    },
    salAppender: {
      type: "file",
      filename: "./logs/sal-digest.log",
      pattern: ".yyyy-MM-dd hh",
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p %c{2} - %m%n'
      }
    },
    dalAppender: {
      type: "file",
      filename: "./logs/dal-digest.log",
      pattern: ".yyyy-MM-dd hh",
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p %c{2} - %m%n'
      }
    },
    errorAppender: {
      type: "file",
      filename: "./logs/common-error.log",
      pattern: ".yyyy-MM-dd hh",
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p %c{2} - %m%n'
      }
    },
    appAppender: {
      type: "file",
      filename: "./logs/app-default.log",
      pattern: ".yyyy-MM-dd hh",
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p %c{2} - %m%n'
      }
    },
    stdout: {
      type: "stdout", 
      filename: "./stdout.log",
      pattern: ".yyyy-MM-dd hh",
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p %c{2} - %m%n'
      }
    }
  },



  categories: {
    "MVC-LOGGER": {
      appenders: ["mvcAppender"],
      level: "info"
    },
    "SAL-LOGGER": {
      appenders: ["salAppender"],
      level: "info"
    },
    "DAL-LOGGER": {
      appenders: ["dalAppender"],
      level: "info"
    },
    "ERROR-LOGGER": {
      appenders: ["errorAppender"],
      level: "error"
    },
    default: {
      appenders: ["stdout", "appAppender"],
      level: "info"
    },
  }
});

function getLogger(type) {
  return log4js.getLogger(type);
}

module.exports = {
  getLogger,
}