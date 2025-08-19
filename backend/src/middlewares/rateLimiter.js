const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests coming from this IP, try again later",
    standartHeaders: true,
    legacyHeaders:false,
});

module.exports = limiter;