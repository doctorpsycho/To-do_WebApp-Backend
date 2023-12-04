const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//defining itemsSchema
const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your To-Do List."
});

const item2 = new Item({
    name: "Add items via text-box."
});

const item3 = new Item({
    name: "To delete items check the checkbox."
});

const item4 = new Item({
    name: "To create a new list change the url. Your old lists will not be deleted."
});

const item5 = new Item({
    name: "To delete an entire list click on the 'Delete List' button."
});

const item6 = new Item({
    name: "To access a list you've already created just change the name of list in url to access it."
});

const item0 = new Item({
    name: "Dom't ask me for a feature to edt items, I'm nit respondible for YOUR* typoz. 😐😐"
});

const defaultItems = [item0];

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
            res.render("toDoList", { listTitle: "Today", newListItems: items });
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


//creating custom list
// app.get("/:customListName", async function (req, res) {
//     const customListName = req.params.customListName;

//     const result = await List.findOne({ name: customListName }).exec();
//     if (result === null) {
//         const list = new List({
//             name: customListName,
//             item: defaultItems
//         });
//         await list.save().then(savedlist => {
//             savedlist === list;
//         });
//         res.redirect("/" + customListName);
//     } else {
//         res.render("toDoList", { listTitle: customListName, newListItems: result.item });
//     };
// });

//deleting list
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

app.get("/createList" , async function ( req, res ){
    const customListName = req.body.nameOfList;
    console.log("name : " + customListName);

    
//     const result = await List.findOne({ name: customListName }).exec();
//     if (result === null) {
//         const list = new List({
//             name: customListName,
//             item: defaultItems
//         });
//         await list.save().then(savedlist => {
//             savedlist === list;
//         });
//         console.log("List saved Successfully!");
//         // res.redirect("/" + customListName);
//     } else {
//         // res.render("toDoList", { listTitle: customListName, newListItems: result.item });
//     };

});

// app.post("/createList", async function (req, res) {
//     // const customListName = req.body.nameOfList;
//     // console.log("name : " + customListName);

//     const result = await List.findOne({ name: customListName }).exec();
//     if (result === null) {
//         const list = new List({
//             name: customListName,
//             item: defaultItems
//         });
//         await list.save().then(savedlist => {
//             savedlist === list;
//         });
//         console.log("List saved Successfully!");
//         // res.redirect("/" + customListName);
//     } else {
//         // res.render("toDoList", { listTitle: customListName, newListItems: result.item });
//     };

// });



app.listen(3000, function () {
    console.log("Server live at Localhost:3000");
});
