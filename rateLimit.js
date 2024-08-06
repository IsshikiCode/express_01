const express = require('express');
const mem = require('memory-cache');

const limiter = express.Router();

const REQUESTS_LIMIT = 20;
const REQUESTS_SIZE = 60 * 1000; // 1 minute

let blockedAddress = {};

limiter.use((req, res, next) => {
    const ipaddr = req.socket.remoteAddress;
    const urlPath = req.path;
    const method = req.method;
    console.log(`IP Address: ${ipaddr}`);
    console.log(`URL Path: ${urlPath}`);
    console.log(`HTTP Method: ${method}`);

    const blockedKey = `${ipaddr}_${urlPath}_${method}`;

    if (blockedAddress[blockedKey] && (Date.now() - blockedAddress[blockedKey].blockedOn) <= REQUESTS_SIZE) {
        return res.status(429).send("You are temporarily blocked already.");
    } else if (blockedAddress[blockedKey]) {
        delete blockedAddress[blockedKey];
    }

    console.log(blockedAddress);

    let currentTime = Date.now();
    const reqTime = Math.floor(currentTime / REQUESTS_SIZE);
    console.log(`Current Request Time: ${currentTime} ms`);

    const cacheKey = `${ipaddr}_${urlPath}_${method}_${reqTime}`;
    const reqCounter = mem.get(cacheKey) || 0;

    console.log(`Cache for ${cacheKey}: ${reqCounter}`);

    if (reqCounter >= REQUESTS_LIMIT) {
        blockedAddress[blockedKey] = { blockedOn: Date.now() };
        return res.status(429).send(`Too many requests to ${method} ${urlPath}. You are temporarily blocked.`);
    }

    mem.put(cacheKey, reqCounter + 1, REQUESTS_SIZE);
    console.log(`Updated Cache for ${cacheKey}: ${mem.get(cacheKey)}`);

    next();
});

module.exports = limiter;
