const express= require('express')
const mongoose  = require('mongoose')

const app = express();
const PORT= 4000

// mongodb connection
mongoose.connect("mongodb://localhost:27017/tharunkumar")
        .then(()=>{
            console.log("MongoDB connected successfully");
        })
        .catch((err)=>{
            console.log(err)
        })

// schema and model
const CarSchema = new mongoose.Schema({
    car_name:{
        type:String,
        required:true
    },
    date_of_sale:{
        type:String,
        required:true
    },
    model_no:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }

})

const CarModel = mongoose.model("tharunkumar",CarSchema)

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))



// To get all cars in collection
app.get('/cars',async(req,res)=>{
    try {
        const allCars= await CarModel.find({})
        if(allCars.length===0){
            return res.status(404).send("No cars found")
        }
        res.send(allCars)
    } catch (error) {
        console.error("Error while fetching cars",error)
        res.status(500).send("Internal server error")
    }
})

// To get latest sold car name
app.get('/latest-sold-car',async(req,res)=>{
    try {
        const latestCar=await CarModel.findOne().sort({date_of_sale:-1})
        if(!latestCar){
            return res.status(404).send("No car sold")
        }
        res.send({car_name:latestCar.car_name})
    } catch (error) {
        console.error("Error while getting latest sold car",error)
        res.status(500).send("Internal server error")
    }
})

// To post a new car
app.post('/cars',async(req,res)=>{
   try{
    const{ car_name,date_of_sale,model_no,price} = req.body
    const car = new CarModel({
        car_name,
        date_of_sale,
        model_no,
        price
    })
    await car.save()
    res.status(201).send("Car added Successfully")
   } catch(error){
      console.error("Error while adding car",error)
      res.status(500).send("Internal server error")
   }

})







app.listen(PORT,()=>{
    console.log(`server is running at Port : ${PORT}`)
})