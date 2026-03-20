const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const redis = require("redis")
const cors = require("cors")
let {RedisStore} = require("connect-redis")


const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET} = require("./config/config")
const app = express()

// 1. Initialize Redis Client
let redisClient = redis.createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT
    }
})


redisClient.connect().catch(console.error);

const protect = require("./middleware/authMiddleware")
const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect(
        mongoURL
    ).then(
        () => console.log("Connected to DB successfully!")
    ).catch((e) => {        
            console.error(e)
            setTimeout(connectWithRetry, 5000)
        }
    )
} 

connectWithRetry()


// allow express to trust whatever nginx server adding anything to req/res .header
app.enable("trust proxy")
app.use(cors())
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,           // Required for Redis stores
    saveUninitialized: false, // Don't save empty sessions (saves memory)
    cookie: {                 // Fixed typo
        secure: false,        // false for local/HTTP testing
        httpOnly: true,
        maxAge: 60000         // 60 seconds
    }
}))
app.use(express.json())
app.get("/api", (req,res) => {
    res.send("<h1>Hi</h2>")
    console.log("Run it")
})

app.use("/api/users", userRouter)
app.use("/api/posts", protect, postRouter)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))