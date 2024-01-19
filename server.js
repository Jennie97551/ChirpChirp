const data = require("./data")

var session = require('express-session')
const express = require("express")
const port = 4139
const app = express()

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.static("resources"));

//dummypost = [{text: "howdy this is a post hehehehe", username: "myUsername123", likes: 100, id: 0}];

app.use(session({
    secret: "supersecretkey",
    saveUninitialized: true,
    cookie: { maxAge: 7200000 },
    resave: false
}));

// get main
app.get("/", async (req, res) => {
    let posts = await data.getPosts();
    posts =  posts.slice(0, 3);
    for(post of posts){
        if(post.user == req.session.userid){
            post.edit = true;
        } else{
            post.edit = false;
        }
    }
    res.render("mainpage.pug", {posts: posts, page: 1});
})

// get main (sort by reverse-temporal)
app.get("/main", async (req, res) => {
    let posts = await data.getPosts();
    let page = parseInt(req.query.page ?? 1)
    if(! page){
        page = 1;
    }
    let offset = (page-1)*3;
    posts =  posts.slice(offset, offset+3);
    for(post of posts){
        if(post.user == req.session.userid){
            post.edit = true;
        } else{
            post.edit = false;
        }
    }
    res.render("mainpage.pug", {posts: posts, page: page, mostliked: false});
})

// get main (sort by most-liked)
app.get("/main-likes", async (req, res) => {
    let posts = await data.getPostsLikes();
    let page = parseInt(req.query.page ?? 1)
    if(! page){
        page = 1;
    }
    let offset = (page-1)*3;
    posts =  posts.slice(offset, offset+3);
    for(post of posts){
        if(post.user == req.session.userid){
            post.edit = true;
        } else{
            post.edit = false;
        }
    }
    res.render("mainpage.pug", {posts: posts, page: page, mostliked: true});
})

// mainpage like a post
app.post("/main", async (req, res) => {
    data.likePost(req.body.id);
    res.sendStatus(200);
})

// mainpage delete a post
app.delete("/api/post", async (req, res) => {
    res.send(await data.deletePost(req.body.id));
})

app.get("/postform", (req,res) => {
    session = req.session;
    if(session.userid){
        res.render("postform.pug");
    } else{
        res.render("loggedOut.pug");
    }
})

app.get("/account", (req,res) => {
    session = req.session;
    if(session.userid){
        res.render("loggedIn.pug", {username: session.userid});
    } else{
        res.render("loggedOut.pug");
    }
})

// post new post
app.post("/postform", async (req, res) => {
    text = req.body.text ?? null;
    if(text === null){
        res.status(400).render("postSubmit.pug", {message: "Invalid Form Submission"});
    }
    data.createPost({text: text, likes: 0, user: req.session.userid});
    res.render("postSubmit.pug", {message: "Your Chirp has been posted on the dashboard."});
})

app.post("/postform/edit", async (req, res) => {
    text = req.body.text ?? null;
    if(text === null){
        res.status(400).render("postSubmit.pug", {message: "Invalid Form Submission"});
    }
    data.editPost({text: text, id: req.body.id});
    res.render("postSubmit.pug", {message: "Your Chirp has been posted on the dashboard."});
})

app.post("/sign-in", async (req, res) => {
    username = req.body.username ?? null;
    password = req.body.password ?? null;
    if(username === null || password === null){
        res.status(400).render("postSubmit.pug", {message: "Invalid Form Submission"});
    }
    if(await data.checkExists({username: username, password: password})){
        session = req.session;
        session.userid = req.body.username;
        res.render("loggedIn.pug");
    } else{
        res.render("postSubmit.pug", {message: "Invalid Username and Password"});
    }
})

app.get("/sign-out", async (req, res) => {
    req.session.destroy();
    res.render("loggedOut.pug");
})

app.post("/create-account", async (req, res) => {
    newusername = req.body.newusername ?? null;
    newpassword = req.body.newpassword ?? null;
    if(newusername === null || newpassword === null){
        res.status(400).render("postSubmit.pug", {message: "Invalid Form Submission"});
    }
    data.createAccount({username: newusername, password: newpassword});
    res.render("postSubmit.pug", {message: "Your account has been created."});
})

app.use((req, res, next) => {
    res.status(404).render("404.pug")
})

app.listen(port , () => {
    console .log(`Example app listening on port ${port}`)
})