create user:
http://localhost:5000/user
body:
{
  "username": "fahim",
  "email": "fahim@example.com",
  "password": "securepassword123",
  "bio": "hardware engineer",
  "interests": ["movie", "journey"]
}

get all user:
http://localhost:5000/user


get user by id:
http://localhost:5000/user/6796a58cf3370f02bc2f81c5








demo data:
{"userId":"6796a58cf3370f02bc2f81c5","username":"kawser","email":"kawser@example.com","bio":"Software Developer","interests":["coding","gaming"]},{"userId":"6796a5abf3370f02bc2f81c7","username":"sam","email":"sam@example.com","bio":"mobile app Developer","interests":["coding","listen song"]},{"userId":"6796a5ecf3370f02bc2f81c9","username":"fahim","email":"fahim@example.com","bio":"hardware engineer","interests":["movie","journey"]}












next step:-
Great job on completing the **data aggregation** and **password hashing**! Now, let’s focus on fulfilling the remaining requirements of the task. I’ll break it down step by step so you can systematically complete the project.

---

### **Remaining Requirements to Fulfill**

#### **1. Secure Communication Between Backends**
- **Requirement**: Secure communication between Backend 1 and Backend 2 using a shared secret or token validation.
- **What to Do**:
  1. Add a **shared secret** or **token validation** mechanism to ensure only authorized requests are processed.
  2. Use environment variables to store the shared secret.
  3. Add middleware in both backends to validate the token.

---

#### **2. Implement Data Aggregation in `GET /user/:id`**
- **Requirement**: Implement the `GET /user/:id` endpoint in Backend 1 to:
  1. Retrieve sensitive data (`username`, `email`) from Backend 1.
  2. Fetch non-sensitive data (`bio`, `interests`) from Backend 2.
  3. Combine the data into a single response.
- **What to Do**:
  1. Implement the `GET /user/:id` endpoint in Backend 1.
  2. Use Axios to fetch non-sensitive data from Backend 2.
  3. Combine the data and return a single response.

---

#### **3. Add Environment Variables**
- **Requirement**: Use environment variables to manage secrets (e.g., MongoDB URI, shared secret).
- **What to Do**:
  1. Create a `.env` file in both Backend 1 and Backend 2.
  2. Store sensitive information (e.g., `MONGO_URI`, `SHARED_SECRET`) in the `.env` file.
  3. Use the `dotenv` package to load environment variables.

---

#### **4. Write a README File**
- **Requirement**: Provide clear instructions in the README file for running and testing the project.
- **What to Do**:
  1. Create a `README.md` file in the root of your project.
  2. Include instructions for:
     - Setting up the project.
     - Running the backends.
     - Testing the endpoints.
  3. Add details about the endpoints and their request/response formats.

---

#### **5. Push to GitHub**
- **Requirement**: Push the code to a GitHub repository with at least 5 commits.
- **What to Do**:
  1. Initialize a Git repository in your project folder.
  2. Commit your changes with meaningful commit messages.
  3. Push the code to GitHub.

---

#### **6. (Optional) Deploy the Backends**
- **Requirement**: Provide a live API link for testing.
- **What to Do**:
  1. Deploy Backend 1 and Backend 2 to a cloud platform (e.g., Heroku, Render, or Vercel).
  2. Provide the live API links in the README file.

---

### **Step-by-Step Implementation**

---

#### **1. Secure Communication Between Backends**
1. **Add a Shared Secret**:
   - In Backend 1 and Backend 2, create a `.env` file and add a shared secret:
     ```env
     SHARED_SECRET=mysecretkey123
     ```

2. **Add Middleware for Token Validation**:
   - In Backend 2, add middleware to validate the token:
     ```javascript
     const validateToken = (req, res, next) => {
       const token = req.headers["authorization"];
       if (!token || token !== process.env.SHARED_SECRET) {
         return res.status(401).json({ message: "Unauthorized" });
       }
       next();
     };

     module.exports = validateToken;
     ```

   - Apply the middleware to the `/profile` routes in Backend 2:
     ```javascript
     const validateToken = require("../middleware/authMiddleware");

     router.use(validateToken); // Apply middleware to all routes
     ```

3. **Send the Token from Backend 1**:
   - When making requests from Backend 1 to Backend 2, include the shared secret in the `Authorization` header:
     ```javascript
     await axios.post("http://localhost:5001/profile", {
       userId: user._id,
       bio,
       interests,
     }, {
       headers: { Authorization: process.env.SHARED_SECRET },
     });
     ```

---

#### **2. Implement `GET /user/:id` Endpoint**
1. **Add the Endpoint in Backend 1**:
   ```javascript
   router.get("/user/:id", async (req, res) => {
     try {
       const user = await User.findById(req.params.id).select("-password");
       if (!user) return res.status(404).json({ message: "User not found" });

       // Fetch non-sensitive data from Backend 2
       const profileResponse = await axios.get(
         `http://localhost:5001/profile/${user._id}`,
         { headers: { Authorization: process.env.SHARED_SECRET } }
       );

       // Combine the data
       const responseData = {
         username: user.username,
         email: user.email,
         bio: profileResponse.data.bio,
         interests: profileResponse.data.interests,
       };

       res.status(200).json(responseData);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

2. **Test the Endpoint**:
   - Use Postman to send a GET request to `http://localhost:5000/user/:id`.

---

#### **3. Add Environment Variables**
1. **Create `.env` Files**:
   - In Backend 1:
     ```env
     MONGO_URI=mongodb://localhost:27017/backend1
     PORT=5000
     SHARED_SECRET=mysecretkey123
     ```

   - In Backend 2:
     ```env
     MONGO_URI=mongodb://localhost:27017/backend2
     PORT=5001
     SHARED_SECRET=mysecretkey123
     ```

2. **Load Environment Variables**:
   - Install the `dotenv` package:
     ```bash
     npm install dotenv
     ```

   - Load the environment variables in `server.js`:
     ```javascript
     require("dotenv").config();
     ```

---

#### **4. Write a README File**
1. **Create `README.md`**:
   ```markdown
   # Two-Backend System

   ## Overview
   This project consists of two backend services:
   - **Backend 1**: Handles sensitive user data (username, email, password).
   - **Backend 2**: Handles non-sensitive profile data (bio, interests).

   ## Setup
   1. Clone the repository:
      ```bash
      git clone https://github.com/your-username/two-backend-system.git
      ```
   2. Install dependencies:
      ```bash
      cd backend1
      npm install

      cd ../backend2
      npm install
      ```
   3. Set up environment variables:
      - Create a `.env` file in both `backend1` and `backend2`.
      - Add the required variables (e.g., `MONGO_URI`, `SHARED_SECRET`).

   ## Running the Backends
   1. Start Backend 1:
      ```bash
      cd backend1
      node server.js
      ```
   2. Start Backend 2:
      ```bash
      cd ../backend2
      node server.js
      ```

   ## Testing
   Use Postman or cURL to test the endpoints:
   - `POST /user` (Backend 1)
   - `GET /user/:id` (Backend 1)
   - `POST /profile` (Backend 2)
   - `GET /profile/:userId` (Backend 2)
   ```

---

#### **5. Push to GitHub**
1. Initialize a Git repository:
   ```bash
   git init
   ```

2. Commit your changes:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/two-backend-system.git
   git branch -M main
   git push -u origin main
   ```

---

#### **6. (Optional) Deploy the Backends**
1. Deploy Backend 1 and Backend 2 to a cloud platform (e.g., Heroku, Render, or Vercel).
2. Update the README file with the live API links.

---

### **Final Checklist**
- [ ] Secure communication between backends.
- [ ] Implement `GET /user/:id` endpoint.
- [ ] Add environment variables.
- [ ] Write a README file.
- [ ] Push to GitHub.
- [ ] (Optional) Deploy the backends.

---

Let me know if you need further assistance! 🚀