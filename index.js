import express from 'express'; //Framework Nodejs
import mongoose from 'mongoose'; //Librería para conectar mongoDB

const personaSchema = new mongoose.Schema({ //Defines un esquema Moongose para guardar en MongoDb
    name: String,
    age: Number,
    email: String
});

const Persona = mongoose.model('Persona', personaSchema); //Y aquí creas el modelo basado en ese esquema
const app = express();

mongoose.connect('mongodb://oliver:password@mongoBaseDatos:27017/mi_base_de_datos?authSource=admin')

app.get('/',async(_req,res) => {
    console.log("Listando...");
    const personas = await Persona.find();
    return res.send(personas);
})

app.get('/crear',async(_req,res) => {
    console.log('Creando nueva persona...')
    await Persona.create({name:"Pepe",email:"pepe4@gmail.com",age:26})
    return res.send('todo ok Jose Luis')
})

app.listen(3000,() => console.log('Escuchando...'))