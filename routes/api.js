/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { googleSearch } = require('../categorize');
const { getList, getAllMyLists, insertToDoItem, updateItem } = require('../server/database');
const userId = 1;
const categories = {
  eat: "e",
  read: "r",
  watch: "w",
  buy: "b"};

module.exports = function(database) {

  router.get('/items/:category', (req, res) => {
    const category = categories[req.params.category];
    if (!category) {
      res.status(404).send('Sorry, we cannot find that!');
      return;
    }
    getList(userId, category)
    .then((queryResults)=>{
      // Send the query results to the front end as json
      res.json(queryResults);
      console.log('API get request results:', queryResults);
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    });
  });


  router.get('/all-lists', (req, res) => {
    getAllMyLists(userId)
    .then((queryResults)=>{
      // Send the query results to the front end as json
      res.json(queryResults);
      console.log(queryResults);
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    });
  });

  router.post('/add-item/:itemname', (req, res) => {
    const searchQuery = req.params.itemname
    const callback = function(listCategory) {
      return listCategory;
    }
    console.log("body", req.body);
    console.log('new item name', searchQuery);
    googleSearch(searchQuery).then(res=>{
      console.log(res);
    });
    // const category = googleSearch(searchQuery);
    // insertToDoItem(req.body)
    // .then(item => {
    //   res.send(item);
    // })
    // .catch(e=>{
    //   console.log(e);
    //   res.send(e);
    // })
  })

  router.post('/update-item/:itemid', (req, res) => {
    const listType = req.body.listType;
    const listId = req.params.itemid;
    const listName = req.body.listName;
    const isChecked = req.body.isChecked;
    updateItem(listId, listType, listName, isChecked)
    .then(item => {
      res.send(item);
    })
    .catch(e=>{
      console.log(e);
      res.send(e);
    })
  });

  return router;
};
