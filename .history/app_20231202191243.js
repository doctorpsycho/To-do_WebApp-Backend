const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB");

app.use(express.static("public"));

//defining itemsSchema
const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item0 = new Item({
    name: "Dom't ask me for a feature to edt items, I'm nit respondible for YOUR* typoz. Wqite carefully from staet. I made typos amd I'm still working with it. We're not the same broski!😐😐"
});

const item1 = new Item({
    name: "Welcomen't to your To-Do List."
});

const item2 = new Item({
    name: "Add items via text-box."
});

const item3 = new Item({
    name: "To delete items check the checkbox."
});

const item4 = new Item({
    name: "To create a new list you can use the box below this one. Your old lists will not be deleted."
});

const item5 = new Item({
    name: "To delete an entire list click on the 'Delete List' button."
});

const item6 = new Item({
    name: "To access a list you've already created just enter the name of list in 'Create List Box' to access it."
});

const item7 = new Item({
    name: "Do not edit this item. However you can delete it."
});

const defaultItems = [item1];

//defining itemsSchema
const listSchema = {
    name: String,
    item: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

//displaying  main list
app.get("/", async function (req, res) {
    try {
        const items = await Item.find();

        if (items.length === 0) {
            await Item.insertMany(defaultItems);
            res.redirect("/");
        } else {
            const allLists = await List.find({}, 'name');
            res.render("toDoList", { listTitle: "Introduction", newListItems: items, allLists: allLists });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while fetching items");
    }
});

//creating main list
app.post("/", async function (req, res) {

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save().then(saveditem => {
        saveditem === item; // true
    });

    res.redirect("/");

});

//deleting items
app.post("/:customListName/delete", async function (req, res) {
    const customListName = req.params.customListName;

    const checkedItemId = req.body.checkbox;
    // console.log(checkedItemId);  //working
    if (customListName === null) {
        await List.findByIdAndDelete(checkedItemId);
        res.redirect("/");
    } else {
        await List.findOneAndUpdate(
            { name: customListName },
            { $pull: { item: { _id: checkedItemId } } },
            { new: true }
        );
        res.redirect("/" + customListName);
    }
});

// edit
app.post("/:customListName/edit", async function (req, res) {
    const customListName = req.params.customListName;
    const checkedItemId = req.body.checkbox;
    const newName = req.body.newName; // Assuming you're sending the updated name from the form
    console.log("List name = " + customListName);
    console.log("Item Id = " + checkedItemId);
    console.log("New name = " + newName);

    try {
        if (!newName) {
            res.status(400).send("Please provide a new name for the item.");
            return;
        }

        let updateQuery;
        if (customListName === null) {
            // Update item in the default list
            updateQuery = { $set: { "item.$[elem].name": newName } };
        } else {
            // Update item in a custom list
            updateQuery = { $set: { "item.$[elem].name": newName } };
        };

        const options = { arrayFilters: [{ "elem._id": checkedItemId }] };

        const updatedList = await List.findOneAndUpdate(
            { name: customListName },
            updateQuery,
            { new: true, useFindAndModify: false, arrayFilters: options.arrayFilters }
        );

        res.redirect("/" + customListName); // Redirect to the list after updating;
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while updating the item.");
    }
});




//creating custom list
app.get("/:customListName", async function (req, res) {
    const customListName = req.params.customListName;
    // console.log("customListName : " + customListName);
    
    const result = await List.findOne({ name: customListName }).exec();
    if (result === null) {
        const list = new List({
            name: customListName,
            item: defaultItems
        });
        await list.save().then(savedlist => {
            savedlist === list;
        });
        res.redirect("/" + customListName);
    } else {
        await List.findOneAndDelete({ name: "app.js" });
        await List.findOneAndDelete({ name: "favicon.ico" });
        const allLists = await List.find({}, 'name');
        res.render("toDoList", { listTitle: customListName, newListItems: result.item, allLists: allLists});
    }; //if else loop to check if a list already exists. If yes it will redirect to it otherwise it wil create one.

});

//deleting list and adding items into list
app.post("/:customListName", async function (req, res) {
    const customListName = req.params.customListName;
    const listDelete = req.body.deleteList;
    if (listDelete === "true") {
        await List.findOneAndDelete({ name: customListName });
        console.log("List Deleted successfully!");
        res.redirect("/");
    } else {
        const itemName = req.body.newItem;
        const list = await List.findOne({ name: customListName });

        if (!list) {
            const newList = new List({
                name: customListName,
                item: [{ name: itemName }]
            });

            await newList.save();
            res.redirect("/" + customListName);
        } else {
            list.item.push({ name: itemName });
            await list.save();
            res.redirect("/" + customListName);
        }
    }

});

app.post("/create/List" , async function ( req, res ){

    const customListName = req.body.nameOfList;
    // console.log("name : " + customListName);
    
    const result = await List.findOne({ name: customListName }).exec();
    if (result === null ) {
        const list = new List({
            name: customListName,
            item: defaultItems
        });
        await list.save().then(savedlist => {
            savedlist === list;
        });
        // console.log("List saved Successfully!");
        res.redirect("/" + customListName);
    } else {
        const allLists = await List.find({}, 'name');
        res.render("toDoList", { listTitle: customListName, newListItems: result.item, allLists: allLists });
    };

});

app.listen(3000, function () {
    console.log("Server live at Localhost:3000");
});

