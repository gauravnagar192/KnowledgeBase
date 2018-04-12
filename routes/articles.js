var express = require('express')
var router = express.Router();
var body = require("body-parser");

var bodyencoder = body.urlencoded({ extended: false }) ;

//bring in models
let Article = require("../models/articles");
let User = require("../models/user");

//add submit POST Route 
router.post("/add", bodyencoder , (req,res) =>{
	req.checkBody('Title','Title is required').notEmpty();
	//req.checkBody('Author','Author is required').notEmpty();
	req.checkBody('Body','Body is required').notEmpty();

	//get errors
	let errors = req.validationErrors();

	if (errors) {
		res.render('add',{
			t: "Add Article",
			errors: errors
		});
	}else{
	let article = new Article({
	title:req.body.Title,
	author:req.user._id,
    body:req.body.Body
    });
	article.save((err) =>{
		if (err) {
			console.log(err);
		}else{
			req.flash("success",'Article Added to the Database')
			res.redirect("/");
		}
	})
	}
})

//get single article
router.get("/display/:id" , (req,res) =>{
	Article.findById(req.params.id, (err, article) =>{
	   User.findById(article.author, (err, id) =>{
	   	res.render("article",{
		article:article,
		user: id.name
	    });
	   }) 
	});
});

//load edit form
router.get("/edit/:id" , ensureAuthenticated , (req,res) =>{
	Article.findById(req.params.id, (err, article) =>{
		if (article.author != req.user._id) {
			req.flash('danger','Not Authorized');
			res.redirect('/');
		}
	    res.render("edit",{
	    t:"Edit Article",	
		article:article
	    });	
	});
});

router.post("/edit/:id", bodyencoder , (req,res) =>{
	let article = {};
	article.title = req.body.Title;
	article.author = req.body.Author;
    article.body = req.body.Body;
    
    let query = {_id:req.params.id} ;
	
	Article.update(query,article,(err) =>{
		if (err) {
			console.log(err);
		}else{
			req.flash('success','Article Updated')
			res.redirect("/");
		}
	})
})
 
router.delete("/:id", (req,res) =>{
	if (!req.user._id) {
		res.status(500).send();
	}

	let query = {_id:req.params.id};

	Article.findByOne(req.params.id, (err , article) =>{
		if(article.author != req.user._id){
		    res.status(500).send();		
		}else{
			Article.remove(query, (err) =>{
		    if(err)
			console.log(err);
		    res.send('Sucess');
	      })
		}
	})
})

//add article
router.get("/add", ensureAuthenticated , (req,res) =>{
	res.render("add",{
		t:"Add Article"
	});
});

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}else{
		req.flash('danger','Please Login');
		res.redirect('/users/login');
	}
}

module.exports = router;