const bodyParser = require("body-parser");
      mongoose = require("mongoose"),
      express = require("express"),
      app = express();
      
// App config      
mongoose.connect("mongodb://localhost/restfulblog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))


//Mongoose Model Config
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  // image: {type: String, default: "placeholderimg.jpg"},
  body: String,
  created: {type: Date, default: Date.now()},
});
const Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes


app.listen(3000, () => {
  console.log("Server is running on port 3000.")
})

