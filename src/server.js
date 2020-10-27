const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('view engine', 'ejs');


app.listen(PORT, () => {
    console.log("listing on the port " + PORT);
})
