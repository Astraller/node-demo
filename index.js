"use strict";
const App = require('./application');
const logger = require('./modules/logger');
const app = new App();

app.launch()
.then(() => logger.add('main', 'Server started'))
.catch((e) => logger.add('main', `[Error] ${e.message}`));