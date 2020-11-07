const express = require('express');
const app = express();
const port = 8000;

let enums = [{id: 1, name: 'UserTypes' }];
let relation_types = [
	{id: 1},
	{id: 2},
	{id: 3}]

let relations = [{item_id:3, from_id: 1, to_id: 2, type: 2}]
let charts = 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});