const bodyParser = require("body-parser"),
  experssSanitzer = require("express-sanitizer");
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  moment = require('moment');

// App config      
mongoose.connect("mongodb://localhost/restfulblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//express sanitizer used after body perser.. why?
app.use(experssSanitzer())
app.use(methodOverride("_method"));

//Mongoose Model Config
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  // image: {type: String, default: "placeholderimg.jpg"},
  body: String,
  // created: { type: Date, default: Date.now() },
  created: { type: String, default: moment() },
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
      console.log("No blogs.");
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
  // Prevents a user from entering scripts in body of blog post
  req.blog.blog.boy = req.sanitize(req.blog.blog.body)
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
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs")
    } else {
      res.render("edit", { blog: foundBlog })
    }
  });
});

// Update
app.put("/blogs/:id", (req, res) => {
  req.blog.blog.boy = req.sanitize(req.blog.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Delete
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      req.redirect("/blogs")
    } else {
      res.redirect("/blogs")
    }
  });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000.")
});

