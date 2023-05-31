import express, { json } from "express"
import fs from "node:fs/promises"
import path from "node:path"

const PORT = process.env.PORT ?? 3000
const app = express()
app.use(json())

app.use((req,res,next)=>{
  console.log('Request received' +req.method+' '+req.url)
  next()
})

app.get('/openapi.yaml', async (req,res)=>{
  try {
    const filePath = path.join(process.cwd(), 'openapi.yaml')
    const yamlData = await fs.readFile(filePath, 'utf-8')
    res.setHeader('Content-Type', 'text/yaml')
    res.send(yamlData)
  } catch (error) {
    console.log("/openapi.yaml",error.message)
    res.status(500).send({error:"/openapi.yaml"})
  }
})

app.listen(PORT, () => {
  try {
    console.log("listen on port"+PORT)
  } catch (error) {
    console.log("error listen on port"+PORT)
  }
})


