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
        .get(projectController.getSpecificProject)
        .put(projectController.putSpecificProject)
        .patch(projectController.patchSpecificProject)
        .delete(projectController.deleteSpecificProject)
        .options(projectController.optionsSpecificProject);
        return projectRouter;
    };
module.exports = routes;
