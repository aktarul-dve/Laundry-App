const mongoose =require("mongoose");
const bcrypt =require("bcryptjs");

const userSchema = new mongoose.Schema({

     name:{
        type: String,
        required: true,
        trim: true
     },
     email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
     },
     password: {
           type: String,
           required: true,  // ⬅️ এই required ফিল্ডটা add করতে ভুল করো না
           minLength: 6,
           select: false     // ⬅️ এটাও optional কিন্তু নিরাপত্তার জন্য ভালো
    },
     role:{
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
     },
},
{timestamps: true}
);

// Password Hash middleware

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    
});

// Match User entered password to Hashed password
userSchema.methods.matchPassword = async function (enterePassword) {
    return await bcrypt.compare(enterePassword, this.password);
};


module.exports = mongoose.model("User",userSchema);