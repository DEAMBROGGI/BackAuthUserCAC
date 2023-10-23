const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI_USERS,{

    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>console.log("Database conected"))
.catch(err=>console.error(err))