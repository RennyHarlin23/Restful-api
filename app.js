const express = require("express");
const app = express();
app.use(express.static("public"));

const ejs = require("ejs");
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
    console.log("Mongoose connected");
}

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
})

const Article = mongoose.model('article', articleSchema);

app.listen(3000, () => console.log("The server is up and running in port 3000"));

app.route('/articles')
    .get((req, res) => {
    Article.find({})
        .then(articles => {
            res.send(articles);
        })
        .catch(err => {
            res.send(err);
        });
    })
    .post((req, res) => {
    Article.create({
        title: req.body.title,
        content: req.body.content,
    })
        .then(() => res.send("Successful"))
        .catch(err => res.send(err));
    })
    .delete((req, res) => {
    Article.deleteMany({})
        .then(() => res.send("Deleted successfully"))
        .catch(() => res.send("Deletion unsuccessful"))
    
});

app.route('/articles/:article')
    .get((req, res) => {
        Article.findOne({ title: req.params.article })
            .then(response => {
                res.send(response);
            })
            .catch(err => res.send(err));
    })
    .put((req, res) => {
        const replace = {
            title : req.body.title,
            content : req.body.content,
        }
        Article.findOneAndReplace({ title: req.params.article }, replace)
            .then(() => res.send("successful"))
            .catch(err => res.send(err));
    })
    .patch((req, res) => {
        Article.findOneAndUpdate({ title: req.params.article }, {$set: req.body})
            .then(() => res.send("successful"))
            .catch(err => res.send(err));
    })
    .delete((req, res) => {
        Article.findOneAndDelete({ title: req.params.article })
            .then(() => res.send("Successful"))
            .catch(err => res.send(err));
    })