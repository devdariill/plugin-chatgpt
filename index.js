import cors from "cors"
import express, { json } from "express"
import fs from "node:fs/promises"
import path from "node:path"

const PORT = process.env.PORT ?? 3000
const app = express()
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: ['http://localhost:3000','https://chat.openai.com'],
}))
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

app.get('/.well-known/ai-plugin.json', async (req,res)=>{
  res.sendFile(path.join(process.cwd(), '/.well-known/ai-plugin.json'))
})

app.get('/logo.png', async (req,res)=>{
  res.sendFile(path.join(process.cwd(), '/logo.png'))
})

// conect to db
app.get('/search',async (req,res)=>{
  const {q} = req.query
  const apiURL = "https://api.github.com/search/repositories?q="+q
  const response = await fetch(apiURL,{
    headers:{
      'User-Agent':'ChatChatGPT Plugin v1.0.0 - @midudev', // para reconocimiento 
      'Accept':'application/vnd.github.v3+json'
    }
  })
  if (!response.ok) {
    res.status(500).send({error:"/search"})
  }
  console.log(response.headers.get('X-RateLimit-Remaining'))
  const json = await response.json()
  const repos = json.items.map(repo=>({
    name:repo.name,
    description:repo.description,
    stars:repo.stargazers_count,
    url:repo.html_url
  }))
  res.send(repos)
})

app.listen(PORT, () => {
  try {
    console.log("listen on port"+PORT)
  } catch (error) {
    console.log("error listen on port"+PORT)
  }
})


