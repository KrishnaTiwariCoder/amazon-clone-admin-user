const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        // username: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     unique: true,
        //     index: true,
        //     lowercase: true,
        // },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        hash_password: {
            type: String,
            required: true,
        },
        phone: { type: String, required: true, unique: true, trim: true },
        pofilePicture: { type: String },
        role: {
            type: String,
            default: "admin"
        }
    },
    { timestamps: true }
);

adminSchema.virtual('password')
    .set(function (password) {
        this.hash_password = bcrypt.hashSync(password, 10);
    });


adminSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.hash_password);
    },
};

module.exports = mongoose.model("Admin", adminSchema);
