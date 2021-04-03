const mongoose  = require('mongoose');

const dbConexion = async() => {

    try{
        await mongoose.connect( process.env.MONGODBCONN, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        } );


        console.log('base de datos online')
    }catch(err){
        console.log(err)
       throw new  Error('error en la conexion a la base de datos');
    }

}




module.exports = {
    dbConexion
}