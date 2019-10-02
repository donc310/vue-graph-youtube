const express = require('express');
const serveStatic = require('serve-static');
const morgan = require('morgan')
const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require("../server/routes/index.routes"))
app.use(serveStatic(__dirname + "/../dist"));
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.debug('App listening on :' + port);
});
