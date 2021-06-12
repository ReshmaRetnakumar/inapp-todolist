const express = require('express');
const router = express.Router();
const { secret } = require('./config.json');
const jwt = require('jsonwebtoken');
module.exports = router;

const users = [{ id: 1, username: 'test', password: 'test' }];

let data = []

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw 'Username or password is incorrect';
  const token = jwt.sign({ sub: username }, secret);
  res.send({
    'response': 'success',
    'data': token
  });
});

router.post('/add_parent_node', (req, res) => {
  const parentNodeDetails = req.body;
  const reqDetails = ['status', 'name', 'taskId'];
  const notFound = isRequired(parentNodeDetails, reqDetails);
  if (notFound.length !== 0)
    throw `Following details not found: ${notFound.join(', ')}`
  data.push(parentNodeDetails)
  res.send(parentNodeDetails.taskId)
});

router.post("/split_task", (req, res) => {
  const subTaskNodeDetails = req.body;
  const reqDetails = ['status', 'name', 'taskId', 'parentId'];
  const notFound = isRequired(subTaskNodeDetails, reqDetails);
  if (data.length === 0)
    throw `No parent/long task added`
  if (notFound.length !== 0)
    throw `Following details not found: ${notFound.join(', ')}`
  if (!data.find(key => key.taskId == subTaskNodeDetails.parentId))
    throw `No task with given parent id found`
  if (data.find(key => key.taskId == subTaskNodeDetails.taskId))
    throw `Duplicate task with given parent id found`
  data.push(subTaskNodeDetails)
  res.send(subTaskNodeDetails.taskId)
});

router.post('/delete_node', (req, res) => {
  const { ids: toBeDeleted } = req.body
  const deleteLogs = [];
  let deletedNodes = [];
  const toBeDeletedNodes = toBeDeleted.split(',').map(x => x.trim())
  toBeDeletedNodes.forEach(nodeElementToDelete => {
    // Checking for nodes which is already deleted as child nodes of previous parents
    if (deletedNodes.indexOf(nodeElementToDelete) !== -1)
      deleteLogs.push(`Deleted: ${nodeElementToDelete}`);
    // If node is not found in task list
    else if (!data.find(key => key.taskId === nodeElementToDelete))
      deleteLogs.push(`No task with given id found: ${nodeElementToDelete}`)
    else {
      let childNodes = recursive(nodeElementToDelete)
      if (childNodes.indexOf(true) !== -1) {
        deleteLogs.push(`Cannot delete node since task is in progress ${nodeElementToDelete}`);
      } else {
        // Delete nodes in childNodes
        childNodes.push(nodeElementToDelete);
        deletedNodes = [...deletedNodes, ...childNodes]
        data = data.filter(key => {
          if (childNodes.indexOf(key.taskId) !== -1)
            return false
          else return true
        })
        deleteLogs.push(`Deleted : ${nodeElementToDelete}`)
      }
    }
  });
  res.send(deleteLogs)
});


const isRequired = (nodeDetails, reqDetails) => reqDetails.filter(detail => !nodeDetails[detail]);

function recursive(taskIdParent) {
  let nodesToDeleted = []
  data.every(el => {
    if (el.taskId === taskIdParent && el.status !== 'completed') {
      nodesToDeleted.push(true)
      return false;
    }
    if (el.parentId !== taskIdParent) {
      return true
    }
    if (el.status !== 'completed') {
      nodesToDeleted.push(true)
      return false;
    }
    if (el.status === 'completed') {
      nodesToDeleted.push(el.taskId)
      nodesToDeleted = [...nodesToDeleted, ...recursive(el.taskId)]
    }
    return true;
  });
  return nodesToDeleted
}