const chalk = require('chalk');
const moment = require('moment');

const tagList = {
  SYSLOG: chalk.grey('[SYSLOG]'),
  SYSERR: chalk.red('[SYSERR]'),
  SUCCESS: chalk.green('[SUCCESS]'),
  INFO: chalk.blue('[INFO]'),
  DEBUG: chalk.magenta('[DEBUG]'),
  DATA: chalk.yellow('[DATA]'),
  COMMAND: chalk.white('[CMD]')
};

const longestTagLength = Math.max(...Object.values(tagList).map(t => t.length));
const getTag = (tag) => `${tagList[tag]}${' '.repeat(longestTagLength - tagList[tag].length)}:`;
const timestamp = () => `${chalk.cyan.bold(`[${moment.utc().format('HH:mm:ss')}]`)}`;

module.exports = {
  syslog: (str) => console.info(`${timestamp()} ${getTag('SYSLOG')} ${str}`),
  syserr: (str) => console.error(`${timestamp()} ${getTag('SYSERR')} ${str}`),
  success: (str) => console.log(`${timestamp()} ${getTag('SUCCESS')} ${str}`),
  info: (str) => console.info(`${timestamp()} ${getTag('INFO')} ${str}`),
  debug: (str) => console.log(`${timestamp()} ${getTag('DEBUG')} ${str}`),
  data: (str) => console.log(`${timestamp()} ${getTag('DATA')} ${str}`),

  startLog: (identifier) => console.log(`${timestamp()} ${getTag('DEBUG')} ${chalk.greenBright('[START]')} ${identifier}`),
  endLog: (identifier) => console.log(`${timestamp()} ${getTag('DEBUG')} ${chalk.redBright('[ END ]')} ${identifier}`),

  timestamp,
  getExecutionTime: (hrtime) => {
    const timeSinceHrMs = (
      process.hrtime(hrtime)[0] * 1000
      + hrtime[1] / 1000000
    ).toFixed(2);
    return `${chalk.yellowBright(
      (timeSinceHrMs / 1000).toFixed(2))
    } seconds (${chalk.yellowBright(timeSinceHrMs)} ms)`;
  },

  printErr: (err) => {
    if (!(err instanceof Error)) {
      console.error(err)
      return;
    }

    console.error(
      !err.stack
        ? chalk.red(err)
        : err.stack
          .split('\n')
          .map((msg, index) => {
            if (index === 0) {
              return chalk.red(msg);
            }

            const isFailedFunctionCall = index === 1;
            const traceStartIndex = msg.indexOf('(');
            const traceEndIndex = msg.lastIndexOf(')');
            const hasTrace = traceStartIndex !== -1;
            const functionCall = msg.slice(
              msg.indexOf('at') + 3,
              hasTrace ? traceStartIndex - 1 : msg.length
            );
            const trace = msg.slice(traceStartIndex, traceEndIndex + 1);

            return `    ${chalk.grey('at')} ${
              isFailedFunctionCall
                ? `${chalk.redBright(functionCall)} ${chalk.red.underline(trace)}`
                : `${chalk.greenBright(functionCall)} ${chalk.grey(trace)}`
            }`;
          })
          .join('\n')
    )
  }
};
