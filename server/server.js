import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('Mongo URI not found in environment variables');
            throw new Error('Mongo URI not found');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}

// Define Mongoose schema and model
const stringSchema = new mongoose.Schema({
    value: { type: String, required: true },
});

const StringModel = mongoose.model('String', stringSchema);

// Define routes
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/strings', async (req, res) => {
    try {
        const strings = await StringModel.find();
        res.json(strings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve strings' });
    }
});

app.post('/api/strings', async (req, res) => {
    try {
        const newString = new StringModel({ value: req.body.value });
        await newString.save();
        res.status(201).json(newString);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save string' });
    }
});

// Start the Express server and connect to MongoDB
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectToMongoDB(); // Connect to MongoDB when the server starts
});
