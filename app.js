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
