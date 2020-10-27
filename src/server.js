const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');

app.set('view engine', 'ejs');
app.set('views', viewsPath)
app.use(express.static(publicPath))

app.get('/', (req, res)=> {
    res.render('index')
})

app.listen(PORT, () => {
    console.log("listing on the port " + PORT);
})
