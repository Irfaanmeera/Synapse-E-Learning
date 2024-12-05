/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response, NextFunction } from 'express'
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ErrorMiddleware } from './middlewares/error'
import morgan from 'morgan';
import dotenv from 'dotenv';
import studentRouter from "./routes/studentRoutes";
import instructorRouter from './routes/instructorRoutes';
import adminRouter from './routes/adminRoutes'
import { io } from "./services/SocketIOServices";
import http from 'http'
import authRouter from './routes/authRoutes'
import logger from './logger'


dotenv.config();


app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
}));
app.options('*', cors()); 

app.use(morgan('dev'))


app.use('/', studentRouter);
app.use("/instructor", instructorRouter);
app.use("/admin", adminRouter)
app.use('/auth', authRouter);


app.use((err: any, req: any, res: any, next: any) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(500).send('Internal Server Error');
});
const httpServer = http.createServer(app);
io.attach(httpServer);



//unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err)
})
app.use(ErrorMiddleware)

export { httpServer };


