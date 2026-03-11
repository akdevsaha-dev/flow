import app from "@/app.js"

console.log(process.env.PORT)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
