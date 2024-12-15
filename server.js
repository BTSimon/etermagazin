const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let articles = [];
const jsonFilePath = 'articles.json';

app.use(express.static(path.join()));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});



app.get('/api/articles', (req, res) => {
    fs.readFile('articles.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: 'Failed to load articles' });
        }

        try {
            const articles = JSON.parse(data);
            res.json(articles); 
        } catch (parseError) {
            console.error('Error parsing JSON file:', parseError);
            return res.status(500).json({ error: 'Failed to parse articles' });
        }
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
  
app.post('/admin/inactivate-article', express.json(), (req, res) => {
    const { id } = req.body; 

    fs.readFile('articles.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading articles.json:', err);
            return res.status(500).json({ error: 'Failed to load articles' });
        }

        try {
            const articles = JSON.parse(data);

            const article = articles.find(article => article.id === id);
            if (!article) {
                return res.status(404).json({ error: 'Article not found' });
            }

            article.active = false; 

            fs.writeFile('articles.json', JSON.stringify(articles, null, 2), 'utf-8', writeErr => {
                if (writeErr) {
                    console.error('Error writing to articles.json:', writeErr);
                    return res.status(500).json({ error: 'Failed to update articles' });
                }

                res.status(200).json({ message: 'Article inactivated successfully', redirectUrl: '/admin' });
            });
        } catch (parseError) {
            console.error('Error parsing articles.json:', parseError);
            return res.status(500).json({ error: 'Failed to parse articles' });
        }
    });
});

app.post('/admin/activate-article', express.json(), (req, res) => {
    const { id } = req.body; 

    fs.readFile('articles.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading articles.json:', err);
            return res.status(500).json({ error: 'Failed to load articles' });
        }

        try {
            const articles = JSON.parse(data);

            const article = articles.find(article => article.id === id);
            if (!article) {
                return res.status(404).json({ error: 'Article not found' });
            }

            article.active = true; 

            fs.writeFile('articles.json', JSON.stringify(articles, null, 2), 'utf-8', writeErr => {
                if (writeErr) {
                    console.error('Error writing to articles.json:', writeErr);
                    return res.status(500).json({ error: 'Failed to update articles' });
                }

                res.status(200).json({ message: 'Article activated successfully', redirectUrl: '/admin' })
            });
        } catch (parseError) {
            console.error('Error parsing articles.json:', parseError);
            return res.status(500).json({ error: 'Failed to parse articles' });
        }
    });
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
	const active = true;
	const id = uuidv4();
  
    const articleData = { id, title, category, imgUrl, date, content, path: articlePath, active };
    const articles = JSON.parse(fs.readFileSync('articles.json', 'utf8') || '[]');
    articles.push(articleData);
    fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
  
    res.send('Article added and new page generated successfully!');
});

function isAdmin(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Invalid token.' });
        }
        next();
    });
}


const jwt = require('jsonwebtoken');

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    const adminCredentials = {
        username: 'admin',
        password: '4186fbee',
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
        const token = jwt.sign({ role: 'admin' }, 'your-secret-key', { expiresIn: '30s' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
