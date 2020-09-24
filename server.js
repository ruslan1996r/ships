const express = require('express')
const app = express()
const PORT = 5000

app.use(express.static(__dirname));
app.use('/', (req, res) => {
    res.sendFile(__dirname + '/public/' + "index.html")
})

app.listen(PORT, () =>
    console.log(`Server was started on: http://localhost:${PORT}`)
)