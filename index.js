const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const config = require("./config");

const passportJWT = require("./middlewares/passportJWT")();
const errorHandler = require("./middlewares/errorHandler");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const followRoutes = require("./routes/follow");

const app = express();

app.use(cors());

// app.set('trust proxy', 1);

// const limiter = rateLimit({
//    windowMs: 10 * 1000, // 10 seconds
//    max: 5 // limit each IP to 5 requests per windowMs
// });

// app.use(limiter);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportJWT.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/post", passportJWT.authenticate(), postRoutes);
app.use("/api/follow", passportJWT.authenticate(), followRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log("Listening");
});