const mongoose = require("mongoose");
// require('mongoose-type-email');

const VaxxSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
    trim: true,
    
  },
  SecondName: {
    type: String,
    required: true,
    trim: true,
    
  },
  email: {
    type: String,
    required: true,
    
},
    DATE:{
        type: String,
        required: true,
    },
    Vaxx:{
        type: String,
        required: true,
    }

}
);

const Vaxx = mongoose.model("Vaxx", VaxxSchema);

module.exports = Vaxx;