import express from 'express'
import cors from  'cors'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


const app = express()
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-requested-with']
}));

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true,limit:"10mb"}));

// Data Sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data Sanitization against XSS
// app.use(xss());

app.use(express.static("Public"));
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import wishlistRouter from './routes/wishlist.routes.js';
import orderRouter from "./routes/order.routes.js";
import complainRouter from './routes/complain.routes.js';
app.use("/api/v1/product",productRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/wishlist",wishlistRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/complain",complainRouter)


export default app ;