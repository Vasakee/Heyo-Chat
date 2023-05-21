const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique:true},
    profilepic: {
        type: String,
        required: true,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
},
    { timestamps: true }
)

userSchema.methods.checkPasswords = async function (PasswordInput) {
    return await bcrypt.compare(PasswordInput, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password =  bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userSchema)

module.exports = User