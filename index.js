import express, { json } from "express"
import crypto from "node:crypto"
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

app.get('/.well-known/ai-plugin.json', async (req,res)=>{
  res.sendFile(path.join(process.cwd(), '/.well-known/ai-plugin.json'))
})

app.get('/logo.png', async (req,res)=>{
  res.sendFile(path.join(process.cwd(), '/logo.png'))
})

// conect to db
let TODOS = [
  {id:crypto.randomUUID(), title:"todo1"},
  {id:crypto.randomUUID(), title:"todo2"},
  {id:crypto.randomUUID(), title:"todo3"},
  {id:crypto.randomUUID(), title:"todo4"},
]
app.get('/todos', async (req,res)=>{
  res.json({todos:TODOS})
})
app.post('/todos', async (req,res)=>{
  const {title} = req.body
  const todo = {id:crypto.randomUUID(), title}
  TODOS.push(todo)
  res.json(todo)
})
app.get('/todos/:id', async (req,res)=>{
  const {id} = req.params
  const todo = TODOS.find(todo=>todo.id===id)
  if(!todo) return res.status(404).json({error:"get not found"})
  res.json(todo)
})
app.put('/todos/:id', async (req,res)=>{
  let newTodo = null
  const {id} = req.params
  const {title} = req.body
  TODOS.forEach((todo,i)=>{
    if(todo.id===id){
      newTodo = {...todo, title}
      TODOS[i] = newTodo
    }
  })
  return res.json(newTodo)
  // TODOS = TODOS.map(todo=>{
  //   if(todo.id===id){
  //     newTodo = {...todo, title}      
  //     return newTodo
  //   }
  //   return todo
  // })
})
app.delete('/todos/:id', async (req,res)=>{
  const {id} = req.params
  TODOS = TODOS.filter(todo=>todo.id!==id)
  res.json({ok:true})
})

app.listen(PORT, () => {
  try {
    console.log("listen on port"+PORT)
  } catch (error) {
    console.log("error listen on port"+PORT)
  }
})


