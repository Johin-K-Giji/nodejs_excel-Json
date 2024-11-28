const express = require('express');
const cors = require('cors');
const excelRoutes = require('./routes/route'); 
const connection = require('./db/db')

const app = express();
const port = 3000;

connection();

// Enable CORS for all requests
app.use(cors());


app.use('/api', excelRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
