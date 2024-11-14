// require('dotenv').config({path: './env'})
import 'dotenv/config'

import mongoose from "mongoose";
import { DB_NAME } from './constant.js';
import connectDB from "./db/index.js";


connectDB();











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