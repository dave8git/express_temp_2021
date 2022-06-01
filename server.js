const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const hbs = require('express-handlebars');
const { callbackify } = require('util');
const port = 8000;

app.engine('.hbs', hbs());
app.set('view engine', '.hbs'); 

// app.use((req, res, next) => {
//     res.show = (name) => {
//         res.sendFile(path.join(__dirname, `/views/${name}`));
//     };
//     next();
// });
const storage = multer.diskStorage({
    destination: path.join(__dirname, '/public'),
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('image');

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.get('/hello/:name', (req, res) => {
    res.render('hello', { layout: false, name: req.params.name });
});

app.post('/contact/send-message', (req, res) => {
    upload(req, res => {
        console.log(req.file);
        res.send('test');
    });
});

app.get('/', (req, res) => {
    res.render('index');
}); 
app.get('/about', (req, res) => {
    res.render('about');
}); 

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/info', (req, res) => {
    res.render('info');
});

app.get('/history', (req, res) => {
    res.render('history');
});

app.post('/contact/send-message', (req, res) => {
  const { author, sender, title, message, image } = req.body;

  if(author && sender && title && message && image) {
    res.render('contact', {message: "Awesome"});
  }
  else {
    res.render('contact', {error: "Not so awesome!"});
  }
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

//app.listen(8000); // można zrobić bez funkcji callback po prostu, żeby nasłuchiwał na porcie 8000
