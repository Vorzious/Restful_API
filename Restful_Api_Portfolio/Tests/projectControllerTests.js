var should = require('should'),
    sinon = require('sinon');

describe('Project Controller Tests:', function(){
    describe('Post', function(){
        it('should not allow an empty name on post', function(){
            var Project = function(project){this.save = function(){};};

            var req = {
                body: {
                    developer: 'WB Support'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            var projectController = require('../controllers/projectController')(Project);

            projectController.post(req, res);

            res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
            res.send.calledWith('Name is required').should.equal(true);
        });
    });
});
