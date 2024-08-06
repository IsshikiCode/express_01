const fs = require('fs');


function createLogs(data){
    const errorLogs = fs.createWriteStream(`${__dirname}/error.log`,{flags:'a'})
    errorLogs.write(`${data} -- Logged at ${new Date().toISOString()} \n`);
    errorLogs.end();
}



const loggerObj = {
    warning : (data)=>createLogs(`[warning]: ${data}`),
    error : (data)=>createLogs(`[error]: ${data}`)
};

module.exports = loggerObj;