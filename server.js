console.log('may the node be with you')
// use express in server.js by requiring it.
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://timmydibs:divJ8DmRM6iJHUGc@cluster0.bbuxpou.mongodb.net/?retryWrites=true&w=majority'



//connect to the mongo database
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
   // tells Express we’re using EJS as the template engine
    app.set('view engine', 'ejs')
    
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())
   //read
    app.get('/', (req, res) => {
      quotesCollection.find().toArray()
      .then(results => {
        res.render('index.ejs', {quotes: results})
        // console.log(results)
      })
      .catch(error => console.error(error))
      
    })
    // creat
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
      .then(result => {
        // console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
    })
    //update
    app.put('/quotes', (req, res) => {
      // console.log(req.body)
      quotesCollection.findOneAndUpdate(
        {name: 'Yoda'},
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert:true
        }
      )
      .then(result => {
        // console.log(result)
        res.json('Success')
      })
      .catch(error => console.error(error))
    })
    //delete
    app.delete('/quotes', (req,res) => {
      quotesCollection.deleteOne(
        {name: req.body.name }
      )
      .then(result => {
        if(result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json("Deleted Darth Vader's quote")
      })
      .catch(error => console.error(error))
    })

    //create server browser can connect to localhost:8000
    app.listen(8000, function () {
      console.log('listening on 8000')
    })
  }
)
.catch(error => console.error(error))







  

  





 