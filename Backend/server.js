const express = require('express');
const env = require('dotenv');
const connectToDatabase = require('./Config/db');
const BodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
//Rest object
const app = express()

//configure env
env.config();

//Enable middleware
app.use(BodyParser.urlencoded({
    extended: true
}));




//routes
const supplierRoutes = require('./Routes/supplierRoutes');
const orderRoutes = require('./Routes/purchaseOrderRoutes');
const itemRoutes = require('./Routes/itemRoutes');



//Enable middleware
app.use(express.json())

//static file
app.use('/public', express.static(path.join(__dirname, "uploads")));

//Connect to database
connectToDatabase();

// app.use(cors());

//cors
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: "GET,POST,PUT,DELETE",
}))


//User middleware routes
app.use('/api/', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/item', itemRoutes);



//Port
const PORT = process.env.PORT || 8000;

//run listen
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});