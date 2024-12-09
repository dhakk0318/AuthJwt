const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const userRouter = require("./routes/userRoutes");

dotenv.config();  

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

 app.use(cors({
  origin: process.env.FRONTEND_URL,  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,   
}));

app.use("/api/users", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});



// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");

// const cookieParser = require("cookie-parser");
// const connectDB = require("./db/db");
// const userRouter = require("./routes/userRoutes");

// dotenv.config();

// connectDB();

// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = [
//   'https://client-kappa-woad.vercel.app',
//   'https://client-5lumph3cj-dhakk78-gmailcoms-projects.vercel.app',
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) { 
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, 
// }));

// app.options('*', cors()); 

// app.use("/api/users", userRouter);

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
