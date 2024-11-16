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

## **6)Cloudinary/Multer File Handling Explanation**

### **Objective**:
The goal is to efficiently handle file uploads (like images) in your Express.js backend. Instead of storing large files directly on your server, we use **Cloudinary** for cloud storage, but the process involves a temporary local storage step using **Multer**.

### **Steps Overview**:

#### 1. **Local Temporary Storage**:
   - Using **Multer** as a middleware, the uploaded files are first saved temporarily in a local directory (e.g., `/public/temp`). 
   - This setup ensures we can perform additional checks or transformations (e.g., resizing, validation) if needed before sending files to the cloud.

#### 2. **Uploading to Cloudinary**:
   - Once a file is locally stored, it is then uploaded to **Cloudinary**. 
   - This step involves:
     - Reading the file from local storage.
     - Uploading it to Cloudinary using their SDK.
     - Retrieving a secure URL for the uploaded file.
   - After a successful upload, the local file is deleted to free up server space and prevent clutter.

So far, we've focused on setting up a backend project following **industry-standard practices**. This includes:

- **Configuring environment files** and managing sensitive data securely.
- **Establishing a scalable folder structure** for better project organization.
- Setting up essential development tools like **Prettier**, **ESLint**, and **Nodemon**.
- Implementing **secure database connections** with proper error handling.
- Creating **centralized error handling** and standardized response utilities.
- Integrating **Multer** and **Cloudinary** for efficient file handling, starting with local temporary storage before uploading to the cloud.

This setup provides a strong foundation for scalable and maintainable backend development.

## **7) Router and Controller Structure**

### **What We're Doing:**
- **userRoutes.js:** Defines HTTP endpoints using `express.Router()` and connects them to controller methods (e.g., `/register`, `/login`).
- **userController.js:** Contains business logic for each endpoint (e.g., user registration, login, fetching profile).
- **app.js:** Imports and mounts `userRoutes` under `/users`, so all user-related routes start with `/users`.

### **Why We Do This:**
- **Separation of Concerns:** Keeps routes and logic separate for better readability and maintainability.
- **Scalability:** Easily add more features without cluttering code.
- **Reusability:** Controller functions can be reused across different parts of the app.
