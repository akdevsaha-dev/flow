import express, { type Request, type Response } from "express"

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
    res.send("Initial setup feel free to change me")
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})
