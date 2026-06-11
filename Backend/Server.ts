import "dotenv/config";
import { v2 as cloudinary } from "cloudinary"
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./Server/Configs/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import AuthRouter from "./Server/Routes/AuthRoutes.js";
import ThumbnailRouter from "./Server/Routes/Thumbnailroutes.js";
import UserRouter from "./Server/Routes/UserRoute.js";

declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        userId: string;
    }
}

await connectDB();
const app = express();
// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}, // 7 day
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL as string,
        collectionName: 'sessions'
    })
}));

app.use('/api/auth',AuthRouter);
app.use('/api/thumbnail',ThumbnailRouter);
app.use('/api/user',UserRouter)


const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});  