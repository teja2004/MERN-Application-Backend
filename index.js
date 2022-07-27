const connectToMongoose = require('./database')

const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Nagateja!')
})

// App Routes
app.use('/api/auth',require('./Routes/Auth'));
app.use('/api/notes',require('./Routes/Notes'));


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`);
    connectToMongoose();
})