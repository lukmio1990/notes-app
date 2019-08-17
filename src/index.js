const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

//Initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main.hbs',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
  })
);
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
//Global Var
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
//Routes

app.use(require('./routes'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));

//Static Files

app.use(express.static(path.join(__dirname, 'public')));

//Server is listening
app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}`);
});
