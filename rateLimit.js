// Desc: Implementing Rate Limiter for the API Calls
const express = require('express');
const fs = require('fs');
const mem = require('memory-cache');


const limiter = express.Router();

const REQUESTS_LIMIT = 10;
const REQUESTS_SIZE = 60 * 1000;// 1 minute

let blockedAddress = {};
console.log(blockedAddress);

limiter.use((req,res,next)=>{
    const ipaddr = req.socket.remoteAddress
    console.log("Ip Address:\n",req.socket.remoteAddress);
    
    if (blockedAddress[ipaddr] && (Date.now()-blockedAddress[ipaddr]["data"]["blockedOn"])<=REQUESTS_SIZE){
        return res.status(429).send("You Are Temporarily Blocked Already")
    }else if (blockedAddress[ipaddr]){
        delete blockedAddress[ipaddr];
    }

    console.log(blockedAddress);

    let currentTime = Date.now();
    const reqTime = Math.floor(currentTime/REQUESTS_SIZE) ;
    console.log(`Current Request Time - ${currentTime}Seconds`);

    console.log("Start of Cache -->\n",mem.get(`${ipaddr}_${reqTime}`));
    

    const myKey = `${ipaddr}_${reqTime}`

    const reqCounter = mem.get(myKey) || 0;

    if (reqCounter>=REQUESTS_LIMIT){
        blockedAddress[ipaddr]={ data: { blockedOn: Date.now() } };
        // blockedAddress[ipaddr]["data"] = {"blockedOn":Date.now()} ;
        return res.status(429).send(`Lots of Requests..May Be youre a Robot...\n Blocked You !`)
    };

    mem.put(myKey,reqCounter+1,REQUESTS_SIZE);
    console.log("Updated Cache -",mem.get(myKey));

    next()
    

    
})


module.exports = limiter;
