const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');       // For Handlebars templating

const app = express();

// For Handlebars templating
// app.engine('hbs', expressHbs({
//     extname: 'hbs',
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout'
// }));
// app.set('view engine', 'hbs');

// app.set('view engine', 'pug')        // For Pug templating

app.set('view engine', 'ejs')   // For EJS templating

app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: 'Page Not Found', path: '404'});
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
