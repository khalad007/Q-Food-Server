const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


// middle ware
app.use(cors());
app.use(express.json());



//for check server is running 
app.get('/', (req, res) => {
    res.send('server is running 11')
})

app.listen(port, () => {
    console.log(`eleven assignment server is running on ${port}`)
})

