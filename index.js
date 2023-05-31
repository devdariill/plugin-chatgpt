import express, { json } from "express"

const PORT = process.env.PORT ?? 3000
const app = express()
app.use(json())

app.use((req,res,next)=>{
  console.log('Request received' +req.method+' '+req.url)
  next()
})



app.listen(PORT, () => {
  try {
    console.log("listen on port"+PORT)
  } catch (error) {
    console.log("error listen on port"+PORT)
  }
})


