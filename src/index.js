// require('dotenv').config({path: './env'})
import 'dotenv/config'

import mongoose from "mongoose";
import { DB_NAME } from './constant.js';
import connectDB from "./db/index.js";
import { app } from './app.js';


connectDB()
.then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
  });
})
.catch((err) => {
  console.log("mongo db connection failed!!!", err);
})











/*
import express from "express"
const app = express();

( async () => {
  try {
    await mongoose.connect(`${process.env.MONDODB_URI}/${DB_NAME}`)
    app.on("error", (err) => {
      console.log("ERROR", err);
      throw err
    })

    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env,PORT}`)
    })
  } catch(err) {
    console.log(err);
    throw err
  }
})()

*/