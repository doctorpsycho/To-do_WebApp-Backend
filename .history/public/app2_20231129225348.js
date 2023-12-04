const mongoose = require("mongoose")
const { boolean } = require("webidl-conversions")

mongoose.connect("mongodb://localhost:27017/Sample",).then(() => {
    console.log("connected to MongoDB successfully")
}).catch((err) => {
    console.log(err)
})

const student = new mongoose.Schema({
    name: String,
    workout: Boolean,
    height: Number,
})
const Student = new mongoose.model("Student", student)

const adder = async () => {

    const ss = await Student.create({
        name: "sherkhan",
        workout: true,
        height: 6
        
    });
console.log(ss)
}
adder();