const mongoose = require('mongoose');


module.exports = async() => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex:true
    };
    try {
        const conn = await mongoose.connect(process.env.DATABASE_KEY, connectionParams)
        console.log(`connected to database ${conn.connection.host} `)
    } catch (error) {
        console.log(`Error in database ${error}`);
        throw error
    }
}