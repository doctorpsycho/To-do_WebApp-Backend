const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

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

Item.insertMany(defaultItems);

app.get("/" , function ( req , res ){
   const blah_blah = Item.find({});
   console.log(blah_blah);
res.render("list" , {listTitle : "Today" , newListItems : items });
});

app.post("/" , function ( req , res ) {
    const item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});



app.listen(3000, function () {
  console.log("Server live at Localhost:3000");
});
