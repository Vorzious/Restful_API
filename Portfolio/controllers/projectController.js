require('mongoose-pagination');

var projectController = function(Proj){
    var newPageNext, newPagePrev;

    var post = function(req, res){
        var nproj = new Proj(req.body);

        if(!req.body.name){
            res.status(400);
            res.send('Name is required');
        } else if(!req.body.developer){
            res.status(400);
            res.send('Developer name is required');
        } else if(!req.body.client){
            res.status(400);
            res.send('Client name is required');
        } else{
            nproj.save();
            res.status(201);
            res.send(nproj);
        }
    };

    var get = function(req, res, next){
        var page = parseInt(req.query.start) || 1;
        // Query enables the get function.
        var query = {};

        // Makes sure not all random user input is being sent to the database.
        if(req.query.client){
            query.client = req.query.client;
        }

        Proj.find().exec((err, countData) => {
            if(err){
                return next(err);
            }
            var countItems = countData.length;
            var limit = parseInt(req.query.limit) || countItems;
            var projs = {};
            var exclude = {__v: 0};

            Proj.find({}, exclude)
                .paginate(page, limit)
                .exec((err, data) => {
                    if(err){
                        return next(err);
                    } else{
                        if(limit > countItems){
                            limit = countItems;
                        }

                    }
                    var totalPages = Math.ceil(countItems / limit);

                    if(err){
                        res.status(500).send(err);
                    } else{
                        if(!req.accepts('json')){
                            res.status(406).send('Not Acceptable');
                        } else{
                            if(page < totalPages){
                                newPageNext = page + 1;
                            }

                            if(page > 1){
                                newPagePrev = page - 1;
                            }

                            var items = projs.items = [];
                            var links = projs._links = {};
                            links.self = {};
                            links.self.href = 'http://' + req.headers.host + '/api/projects';

                            var pagination = projs.pagination = {};
                            pagination.currentPage = page;
                            pagination.currentItems = limit;
                            pagination.totalPages = totalPages;
                            pagination.totalItems = countItems;

                            var paginationLinks = pagination._links = {};
                            paginationLinks.first = {};
                            paginationLinks.last = {};
                            paginationLinks.previous = {};
                            paginationLinks.next = {};

                            paginationLinks.first.page = 1;
                            paginationLinks.first.href = 'http://' + req.headers.host + '/api/projects/?' + 'start=' + 1 + '&limit' + limit;

                            paginationLinks.last.page = totalPages;
                            paginationLinks.last.href = 'http://' + req.headers.host + '/api/projects/?' + 'start=' + totalPages + '&limit=' + limit;

                            paginationLinks.previous.page = newPagePrev;
                            paginationLinks.previous.href = 'http://' + req.headers.host + '/api/projects/?' + 'start=' + newPagePrev + '&limit=' + limit;

                            paginationLinks.next.page = newPageNext;
                            paginationLinks.next.href = 'http://' + req.header.host + 'api/projects/?' + 'start=' + newPageNext + '&limit' + limit;

                            data.forEach(function(element, index, array){
                                var newProject = element.toJSON();
                                var linksProjects = newProject._links = {};
                                linksProjects.self = {};
                                linksProjects.collection = {};
                                linksProjects.self.href = 'http://' + req.headers.host + '/api/projects/' + newProject._id;
                                linksProjects.collection.href = 'http://' + req.headers.host + '/api/projects/';

                                items.push(newProject);
                            });
                            res.json(projs);
                        }
                    }
                });
            });

        // Proj.find(query, function(err, projects){
        //     if(err){
        //         res.status(500).send(err);
        //     } else{
        //         if(!req.accepts('json')){
        //             res.status(406).send("Not Acceptable");
        //         } else{
        //             // var returnProjects = [];
        //             var projs = {};
        //             var items = projs.items = [];
        //             var links = projs._links = {};
        //             links.self = {};
        //             links.self.href = 'http://' + req.headers.host + '/api/projects';
        //
        //             projects.forEach(function(element, index, array){
        //                 var newProject = element.toJSON();
        //                 var linksProjects = newProject._links = {};
        //                 linksProjects.self = {};
        //                 linksProjects.collection = {};
        //                 linksProjects.self.href = 'http://' + req.headers.host + '/api/projects/' + newProject._id;
        //                 linksProjects.collection.href = 'http://' + req.headers.host + '/api/projects/';
        //
        //                 items.push(newProject);
        //             });
        //             res.json(projs);
        //         }
        //     }
        // });
    };

    var options = function(req, res){
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.end();
    };

    return{
        post: post,
        get: get,
        options: options
    };
};
module.exports = projectController;
