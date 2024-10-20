const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let articles = [];

app.use(express.static(path.join()));

app.get('/', (req, res) => {
  res.sendFile(path.join('index.html'));
  fs.readFile('articles.json', (err, data) => {
    if (err) {
        console.error('Error reading JSON file', err);
        res.send('Error loading articles');
        return;
    }

    const articles = JSON.parse(data);

    res.render('index', { articles });
});
});


  
app.use('/articles', express.static(path.join('articles')));

app.get('/articles/:article', (req, res) => {
    const { article } = req.params;
    const articleFilePath = path.join('articles', `${article}.html`);
    
if (fs.existsSync(articleFilePath)) {
    res.sendFile(articleFilePath);
} 
else {
    res.status(404).send('Article not found.');
}
});
  

app.post('/admin/add-article', (req, res) => {
    const { title, category, imgUrl, date, content } = req.body;
  
    const articleHtml = `
<!DOCTYPE html>
<html class="no-js">
	<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>${title} - Éter Magazin</title>

	<meta property="og:title" content=""/>
	<meta property="og:image" content=""/>
	<meta property="og:url" content=""/>
	<meta property="og:site_name" content=""/>
	<meta property="og:description" content=""/>
	<meta name="twitter:title" content="" />
	<meta name="twitter:image" content="" />
	<meta name="twitter:url" content="" />
	<meta name="twitter:card" content="" />

	<link rel="shortcut icon" href="../favicon.ico">
	<link href='http://fonts.googleapis.com/css?family=Playfair+Display:400,700,400italic|Roboto:400,300,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="../css/animate.css">
	<link rel="stylesheet" href="../css/icomoon.css">
	<link rel="stylesheet" href="../css/bootstrap.css">

	<link rel="stylesheet" href="../css/style.css">

	<script src="js/modernizr-2.6.2.min.js"></script>

	</head>
	<body>
	<div id="fh5co-offcanvas">
		<a href="#" class="fh5co-close-offcanvas js-fh5co-close-offcanvas"><span><i class="icon-cross3"></i> <span>Bezár</span></span></a>
		<div class="fh5co-bio">
			<figure>
				<img src="../images/Logo.jpg" class="img-responsive">
			</figure>
			<h3 class="heading">Rólunk</h3>
			<h2>Név</h2>
			<p>Bemutatkozás </p>
			<ul class="fh5co-social">
				<li><a href="#"><i class="icon-twitter"></i></a></li>
				<li><a href="#"><i class="icon-facebook"></i></a></li>
				<li><a href="#"><i class="icon-instagram"></i></a></li>
			</ul>
		</div>

		<div class="fh5co-menu">
			<div class="fh5co-box">
				<h3 class="heading">Kategóriák</h3>
				<ul>
					<li><a href="../catpage1.html">Kategória 1</a></li>
					<li><a href="../catpage1.html">Kategória 2</a></li>
					<li><a href="../catpage1.html">Kategória 3</a></li>
					<li><a href="../catpage1.html">Kategória 4</a></li>
					<li><a href="../catpage1.html">Kategória 5</a></li>
				</ul>
			</div>
			<div class="fh5co-box">
				<h3 class="heading">Keresés</h3>
				<form action="#">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="Kulcsszó keresése">
					</div>
				</form>
			</div>
		</div>
	</div>

	<header id="fh5co-header">
		
		<div class="container-fluid">

			<div class="row">
				<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>
				<ul class="fh5co-social">
					<li><a href="#"><i class="icon-twitter"></i></a></li>
					<li><a href="#"><i class="icon-facebook"></i></a></li>
					<li><a href="#"><i class="icon-instagram"></i></a></li>
				</ul>
				<div class="col-lg-12 col-md-12 text-center">
					<h1 id="fh5co-logo"><a href="/">ÉTER MAGAZIN <sup></sup></a></h1>
				</div>

			</div>
		
		</div>

	</header>
	<div class="container-fluid">
		<div class="row fh5co-post-entry single-entry">
			<article class="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12 col-xs-offset-0">
				<figure class="animate-box">
					<img src="${imgUrl}" alt="${title}" class="img-responsive">
				</figure>
				<h2 class="fh5co-article-title animate-box">${title}</h2>
				<span class="fh5co-meta fh5co-date animate-box">${date}</span>
			<div class="row">
				<div class="offset-lg-2">
					<p class="text-justify">
                    ${content}
					</p>
				</div>
			</div>
		</article>
		</div>
	</div>

	<footer id="fh5co-footer">
		<p><small>&copy; Éter Magazin 2024 ©</p>
	</footer>
	
	<script src="../js/jquery.min.js"></script>
	<script src="../js/jquery.easing.1.3.js"></script>
	<script src="../js/bootstrap.min.js"></script>
	<script src="../js/jquery.waypoints.min.js"></script>
	<script src="../js/main.js"></script>

	</body>
</html>`;
  
    const articlePath = path.join('articles', `${title.replace(/\s+/g, '-').toLowerCase()}.html`);
  
    if (!fs.existsSync(path.dirname(articlePath))) {
      fs.mkdirSync(path.dirname(articlePath), { recursive: true });
    }
  
    fs.writeFileSync(articlePath, articleHtml, 'utf8');
  
    const articleData = { title, category, imgUrl, date, content, path: articlePath };
    const articles = JSON.parse(fs.readFileSync('prioArticles.json', 'utf8') || '[]');
    articles.push(articleData);
    fs.writeFileSync('prioArticles.json', JSON.stringify(articles, null, 2));
  
    res.send('Article added and new page generated successfully!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
