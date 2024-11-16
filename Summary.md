# Backend Development Best Practices (Chai aur Code Series)

## **1) Environment Configuration & Project Setup**
   - **Environment Files**:
     - **.env**: Store sensitive configurations like `PORT`, `MONGODB_URI`, `JWT_SECRET`, etc.
     - **.env.sample**: Document essential environment variables for other developers.
   - **Dev Tools**:
     - Install **Prettier** for consistent code formatting, configured via `.prettierrc`.
     - Use **Nodemon** for auto-restarting the server during development:
       ```bash
       npm install --save-dev nodemon
       ```
     - Use **ESLint** for identifying problematic patterns in JavaScript:
       ```bash
       npm install eslint --save-dev
       ```
   - **Scripts**:
     - Define custom scripts in `package.json`:
       ```json
       "scripts": {
         "start": "node index.js",
         "dev": "nodemon index.js"
       }
       ```
   - **Folder Structure**:
     - Follow a scalable folder structure:
       ```
       ├── controllers
       ├── models
       ├── routes
       ├── middlewares
       ├── utils
       ├── db
       └── config
       ```

## **2) Database Configuration & Connection (MongoDB)**
   - **Connecting to MongoDB**:
     ```javascript
      import mongoose from "mongoose";
      import { DB_NAME } from "../constant.js";

      const connectDB = async () => {
        try {
          const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
          console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`)

        } catch (error) {
          console.log("MONGODB connection error", error);
          process.exit(1)
        }
      }

      export default connectDB;
     ```
   - **Best Practices**:
     - Handle connection errors using `try-catch` blocks and exit the process gracefully on failure.
     - Store the database URL in the `.env` file for security.

## **3) Error Handling & Response Standardization (utils)**
   - **Centralized Error Handler**:
     ```javascript
     app.use((err, req, res, next) => {
       const status = err.statusCode || 500;
       res.status(status).json({ success: false, message: err.message });
     });
     ```
   - **Custom Error Class (ApiError.js)**:
     ```javascript
      class ApiError extends Error {
      constructor(
          statusCode,
          message= "Something went wrong",
          errors = [],
          statck = ""
      ){
          super(message)
          this.statusCode = statusCode
          this.data = null
          this.message = message
          this.success = false;
          this.errors = errors
          if (statck) {
              this.stack = statck
          } else{
              Error.captureStackTrace(this, this.constructor)
          }
      }
      }
      export {ApiError}
     ```
   - **API Response Utility**:
     ```javascript
     const apiResponse = (res, status, data, message) => {
       res.status(status).json({ success: status < 400, data, message });
     };
     ```

## **4) User Management & Authentication Flow**
   - **User Model**:
     ```javascript
     const mongoose = require('mongoose');
     const userSchema = new mongoose.Schema({
       username: { type: String, required: true, unique: true },
       password: { type: String, required: true },
     });
     module.exports = mongoose.model('User', userSchema);
     ```
   - **Password Hashing**:
     ```javascript
     const bcrypt = require('bcrypt');
     userSchema.pre('save', async function(next) {
       if (this.isModified('password')) {
         this.password = await bcrypt.hash(this.password, 10);
       }
       next();
     });
     ```

## **5) Middleware & Custom Utilities**
   - **CORS & Cookie Handling**:
     ```javascript
     const cors = require('cors');
     const cookieParser = require('cookie-parser');
     app.use(cors());
     app.use(cookieParser());
     ```
   - **Rate Limiting**:
     ```bash
     npm install express-rate-limit
     ```
     ```javascript
     const rateLimit = require('express-rate-limit');
     const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
     app.use(limiter);
     ```
