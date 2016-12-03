var express = require('express');
var routes = function(Proj){
    var projectRouter = express.Router();
    var projectController = require('../controllers/projectController')(Proj);

    projectRouter.route('/')
        .post(projectController.post)
        .get(projectController.get)
        .options(projectController.options);

    projectRouter.use('/:projectId', function(req, res, next){
        var exclude = {__v: 0};
        
        Proj.findById(req.params.projectId, exclude, function(err, project){
            if(err){
                res.status(500).send(err);
            } else if(project){
                req.project = project;
                next();
            } else{
                res.status(404).send('No project found');
            }
        });
    });

    projectRouter.route('/:projectId')
        .get(function(req, res){
            //  var returnProject = req.project.toJSON();
            //  returnProject._links = {};
            //  var newLink = 'http://' + req.headers.host + '/api/projects/?developer=' + returnProject.developer;
            //  returnProject._links.FilterByThisDeveloper = newLink.replace(' ', '%20');

            res.json(req.project);
        })
        .put(function(req, res){
            req.project.name = req.body.name;
            req.project.description = req.body.description;
            req.project.developer = req.body.developer;
            req.project.client = req.body.client;
            req.project.typeOfProject = req.body.typeOfProject;
            req.project.completed = req.body.completed;

            req.project.save(function(err){
                if(err){
                    res.status(500).send(err);
                } else{
                    res.json(req.project);
                }
            });
        })
        .patch(function(req, res){
            if(req.body._id){
                delete req.body._id;
            }

            for(var p in req.body){
                req.project[p] = req.body[p];
            }
            req.project.save(function(err){
                if(err){
                    res.status(500).send(err);
                } else{
                    res.json(req.project);
                }
            });
        })
        .delete(function(req, res){
            req.project.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else {
                    res.status(204).send('Removed');
                }
            });
        })
        .options(function(req, res){
            res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
            res.end();
        });
        return projectRouter;
    };
module.exports = routes;
