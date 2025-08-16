import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnect from './config/db.js';
import userRoute from './routes/userRoutes.js';
import eventRoute from './routes/eventRoutes.js';
import morgan from 'morgan';
import connectCloudinary from './middleware/cloudinary.js';
import bookingRoute from './routes/bookingsRoutes.js';
import reviewRoute from './routes/reviewRoutes.js'
import bodyParser from 'body-parser';
import { stripeWebhook } from './controllers/bookingController.js';
const app = express();


// mongo
dbConnect()
connectCloudinary()

// middleware
app.use(morgan('dev')); // for logging requests
app.use(cors({
      origin: "http://localhost:5173",
  credentials: true

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'))

//end pointes
app.use('/api/users', userRoute)
app.use('/api/events', eventRoute)
app.use('/api/bookings', bookingRoute)
app.use('/api/reviews', reviewRoute)

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.post("/stripe",
    bodyParser.raw({ type: "application/json" }),
    stripeWebhook
);


const PORT = process.env.PORT || 5000


if (process.env.NODE_ENV !== "production") {
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})
}
export default app