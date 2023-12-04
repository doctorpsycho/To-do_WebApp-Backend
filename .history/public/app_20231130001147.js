const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemsSchema = {
    name : String
};

const Item = mongoose.model( "Item" , itemsSchema );

const item1 = new Item ({
    name : "Welcome to your To-Do List."
});

const item2 = new Item ({
    name : "Add items via text-box."
});

const item3 = new Item ({
    name : "To delete items check the checkbox."
});

const defaultItems = [ item1, item2, item3 ];

// Item.insertMany(defaultItems);


app.get("/", async function (req, res) {
    try {
      const items = await Item.find(); 
  
      if (items.length === 0) {
        await Item.insertMany(defaultItems); 
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: items });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error occurred while fetching items");
    }
  });

app.post("/" , async function ( req , res ) {
    
    const itemName = req.body.newItem;

    const item = new Item({
        name : itemName
    });

    item.save().then(saveditem => {
        saveditem === item; // true
      });

      res.redirect("/");

});

app.post("/delete" , async function( req , res){
    const itemId = req.body.checkbox;
    await Item.delete(itemId);
    // console.log(itemId);
    res.redirect("/");
});

app.get("/work" , function ( req ,res ){
    res.render("list" , {listTitle: "Work List" , newListItems: workItems});
});

app.listen(3000, function () {
  console.log("Server live at Localhost:3000");
});
