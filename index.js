const express = require('express');
const app = express();
const cors = require('cors');
const { port, host } = require('./config/index');
const eventsApi = require('./routes/events');
const authApi = require('./routes/auth');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080'
}));

authApi(app);
eventsApi(app);

app.listen(port, host, () => {
    console.log(`The server is running on port http://localhost:${port}`);
});