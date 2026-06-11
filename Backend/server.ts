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
    // Remove trailing slash if user accidentally added it in Vercel
    const cleanUrl = process.env.FRONTEND_URL.endsWith('/') 
        ? process.env.FRONTEND_URL.slice(0, -1) 
        : process.env.FRONTEND_URL;
    allowedOrigins.push(cleanUrl);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


app.use(express.json());
app.set("trust proxy", 1); // Enable trust proxy for Vercel

app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    },
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