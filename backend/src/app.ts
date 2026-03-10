import express, { type Request, type Response } from "express"

const app = express()
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Initial setup feel free to change me")
})


export default app;
