const express = require('express');

const router = express.Router();

const projectDb = require('./data/helpers/projectModel');

//GETS ALL PROJECTS
router.get('/', (req, res) => {
    projectDb.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        res.status(500).json({ error: "GET FAILED!"})
    })
});


//GETS ALL ACTIONS FOR A PROJECT
router.get('/:id', validateProject, (req, res) => {
   
    projectDb.getProjectActions(req.project)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        res.status(500).json({ error: "GET PROJECT ACTION FAILED!"})
    })
});


//DELETES A PROJECT
router.delete('/:id/actions', validateProject, (req, res) => {

    projectDb.remove(req.project)
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: "DELETE FAILED!"})
   
    })

});


//CREATES A PROJECT
router.post('/', (req, res) => {
    const {name, description} = req.body;

    if (!name || !description){
        res.status(400).json({ error: "Please provide a name and description"})
    } else {
        projectDb.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({ error: "POST PROJECT FAILED!"})
        })
    }
});

//UPDATES A PROJECT BY ID
router.put('/:id', validateProject, (req, res) => {
    const {name, description} = req.body;

    if (!name || !description){
        res.status(400).json({ error: "Please provide a name and description"})
    } else {
        projectDb.update(req.project, req.body)
        .then(update => {
            res.status(200).json(update)
        })
        .catch(err => {
            res.status(500).json({ error: "UPDATE PROJECT FAILED!"})
        })
    }

});

//middleware

function validateProject(req, res, next) {
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
} 


module.exports = router;