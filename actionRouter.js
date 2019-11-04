const express = require('express');

const router = express.Router();

const actionDb = require('./data/helpers/actionModel');
const projectDb = require('./data/helpers/projectModel');

//GET ALL ACTIONS
router.get('/', (req, res) => {
    actionDb.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        res.status(500).json({ error: "GET FAILED!"})
    })
});


//GET ACTION BY ID
router.get('/:id', validateActionId, (req, res) => {
    actionDb.get(req.action)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        res.status(500).json({ error: "GET ACTION FAILED"})
    })
});


//CREATES NEW ACTION AFTER VALIDATING ID
router.post('/:id', validateProject, (req, res) => {
    const {description, notes} = req.body;
    req.body.project_id = req.project;

    console.log(req.body);
    if (!description || !notes){
        res.status(400).json({ message: "POST ACTION FAILED!"})
    } else {
        actionDb.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            res.status(500).json({ error: "SERVER POST ACTION PROBLEM"})
        })
    }
})

//DELETE AN ACTION
router.delete('/:id', validateActionId, (req, res) => {
 
    actionDb.remove(req.action)
    .then(actions => {
        res.status(204).json(req.action);
    })
    .catch(err => {
        res.status(500).json({ error: "DELETE FAILED!"})
   
    })

})

//UPDATES AN ACTION
router.put('/:id', validateActionId, (req, res) => {
    const {description, notes} = req.body;

    if (!description || !notes){
        res.status(400).json({ error: "Please provide a description and notes"})
    } else {
        actionDb.update(req.action, req.body)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            res.status(500).json({ error: "UPDATE ACTION FAILED"})
        })
    }
})


//middleware
function validateActionId(req, res, next) {
    actionDb.get(req.params.id) //GETS AN ACTION BY AN ID
    .then(action => {
        if (!action){ //IF NO ACTION ID
            res.status(400).json({ error: "ACTION ID IS WRONG"})
        } else {
            req.action = req.params.id //assigns req.action to the id instead of req.action change to req.actionid
            next();
        }
    })
};

function validateProject(req, res, next) {
    console.log(req.params.id)
    projectDb.get(req.params.id)
        .then(proj => {
            if (!proj) {
                res.status(400).json({Error: "No project with that ID"})
            } else {
                req.body.project_id = proj.project_id //assigns the left to proj.project_id
                req.project = req.params.id //assigns req.project to id
                next()
            }
        })
        .catch(err => {
            res.status(500).json({ error: "VALIDATE PROJECT ERROR"})
        })
} 

module.exports = router;