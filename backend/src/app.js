import express, {urlencoded} from 'express'
import cors from 'cors'
const app=express()

app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cors()) 

export default app

