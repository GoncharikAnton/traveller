const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const tourRouter = require(`${__dirname}/routes/tourRoutes`)
const tourCategoryRouter = require(`${__dirname}/routes/tourCategoryRoutes`)
const userRouter = require(`${__dirname}/routes/userRoutes`)
const path = require("path");

const app = express();

const PORT = config.get('PORT') || 5000;


// 1) MIDDLEWARES

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime)
    next();
})

// USE STATIC FILES
app.use(express.static(path.join(__dirname, 'static')));


// 3)ROUTS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/category', tourCategoryRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;