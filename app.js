//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//DataBase connection
mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("article",articleSchema);

//Request handling all articles//

app.route("/articles").get(function(req,res){
  Article.find({},function(err, data){
    if(err){
      res.send(err);
    }else{
      res.send(data);
    }
  })
}).post(function(req,res){
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });

  article.save(function(err){
    if(err){
      res.send(err);
    }else{
        res.send("Inserted new item succesfully!")
    }
  });
}).delete(function(req,res){
  Article.deleteMany({},function(err){
    if(err){
      res.send("Succesfully deleted all articles.")
    }else{
      res.send(err);
    }
  });
});
//Request handling a specific article//

app.route("/articles/:articleTitle")

.get(function(req,res){
  const requestedTitle = req.params.articleTitle;
  Article.findOne({title: requestedTitle},function(err,data){
    if(data){
      res.send(data);
    }else{
      res.send("No Article matching that article was found.");
    }
  });
})

.put(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Updated Article succesfully");
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(req,res){
      if(err){
        res.send(err);
      }else{
        res.send("Succesfully Updated!");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Succesfully Deleted.")
      }
    }
  );
});

//Listens for connections on given path
app.listen(3000,function(){
  console.log("Server is up and running on port 3000.");
});
