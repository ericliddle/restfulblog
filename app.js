const bodyParser = require("body-parser");
mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  moment = require('moment');

// App config      
mongoose.connect("mongodb://localhost/restfulblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))

// var date = '2015-04-03';
// var format = 'LLLL';
// var result = moment(date).format(format);

//Mongoose Model Config
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  // image: {type: String, default: "placeholderimg.jpg"},
  body: String,
  // created: { type: Date, default: Date.now() },
  created: { type: String, default: moment()},
});
const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test blog",
//   image: "https://images.unsplash.com/photo-1511468752539-facd2a2dff50?ixlib=rb-0.3.5&s=56b779b5d40051bfc60d8b59683d3664&auto=format&fit=crop&w=1350&q=80",
//   body: "This is the test blog."
// });

// RESTful Routes
app.get("/", (req, res) => {
  res.redirect("/blogs")
})

// Index Route
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log("Ya da fucked up.");
    } else {
      res.render("index", { blogs: blogs });
    }
  })
})

// New post route
app.get("/blogs/new", (req, res) => {
  res.render("new");
})

// Create Route
app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      req.render("new");
    } else {
      res.redirect("/blogs")
    }
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, blogPost) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: blogPost })
    }
    // res.send("Balls.")
  })
})

app.listen(3000, () => {
  console.log("Server is running on port 3000.")
})

