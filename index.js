const express = require('express');
const app = express();
const { port, host } = require('./config/index');
const eventsApi = require('./routes/events');
const authApi = require('./routes/auth');

app.use(express.json());

authApi(app);
eventsApi(app);

app.listen(port, host, () => {
    console.log(`The server is running on port http://localhost:${port}`);
});