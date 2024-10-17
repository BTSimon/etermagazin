const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

let articles = [];

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function saveArticles(articles) {
    const filePath = path.join(__dirname, 'articles.json');
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf8');
}

function getArticles() {
    const filePath = path.join(__dirname, 'articles.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data); 
  }
  
app.get('/articles', (req, res) => {
    const articles = getArticles();
    res.json(articles);  
});

app.post('/admin/add-article', (req, res) => {
    const newArticle = {
        id: Date.now(),  
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        date: new Date().toISOString().split('T')[0]
    };
  
    const articles = getArticles();
    articles.push(newArticle);
    saveArticles(articles); 
    res.send('Cikk sikeresen hozzáadva!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
