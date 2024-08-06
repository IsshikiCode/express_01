const fs = require('fs');
const path = require('path');


function createLogs(data){
    const errorLogs = path.join(__dirname,'error.log');
    const logData = `${data} -- Logged at ${new Date().toISOString()} \n`;
    fs.appendFile(errorLogs, logData, (err)=>{
        if(err){
            console.error("Logging Failed")
        }
    })
}



const loggerObj = {
    warning : (data)=>createLogs(`[warning]: ${data}`),
    error : (data)=>createLogs(`[error]: ${data}`)
};

module.exports = loggerObj;