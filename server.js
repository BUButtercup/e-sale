const express = require('express');
const sequelize  = require('./config/connection');
const routes = require('./routes');
require('dotenv').config();
// const {Product, Category, Tag} = require('./models')
// import sequelize connection


const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
})

