var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Question = require('../db/schema.js').Question;



// checkout a question
router.post('/checkout', function(req, res) {
    console.log('entered post question checkout!');
    console.log(req.body);
    var sess = req.session;
    var sid = req.sessionID;
    
    var question = req.body.question;
    var ret = {};
            
    Question.findOne({'question': question}, function (err, record) {
        if (err) return handleError(err);
        if (!record) {
            ret.status = "error";
            ret.errorno = 1;  //"this question does not exist."
            res.json(ret);
        }
        else{							   
            //return success
            ret.status = "success";
            ret.errorno = 0;  //success
            ret.body = record;
            res.json(ret);
        }
    }); 
 });

// checkin a question
router.post('/checkin', function(req, res) {
    console.log('entered post question checkout!');
    console.log(req.body);
    var sess = req.session;
    var sid = req.sessionID;
    
    var ret = {};
    var question = req.body.question;
    
    
    Question.findOne({'question': question}, function (err, record) {
        if (err) return handleError(err);
        if (!record) { //new question
            console.log('it is a new question.');
            var newquestion = new Question(req.body);
            newquestion.save(function(err,user){
                if(err) return handleError(err);
                //return success
                ret.status = "add";
                ret.errorno = 0;
                res.json(ret);
            });
        }
        else{ //update question 
            console.log('it is a existing question.');
            record.yes = req.body.yes;
            record.no = req.body.no;
            record.text = req.body.text;
            record.email = req.body.email;
            record.save(function(err) {
                if(err) return handleError(err);                
                    ret.status = "update";
                    ret.errorno = 0;
                    res.json(ret);  
            });
        }
    });
    
});


//list all playduino project
router.post('/all', function(req, res){
    console.log('entered post question all!');
           var ret = {};
           
           ret.status = "error";
           ret.errorno = 1;  //not yet logged in
           
           
           Question.find({})
           .select('_id question yes no')
           .exec(function(err, question_list){
               console.log('found question list!');
               console.log(question_list);
                 if (err) return next(err);
                 ret.status = "success";
                 ret.errorno = 0;
                 ret.body = question_list;
                 res.json(ret);
                 });          
});

// open a question
router.post('/open', function(req, res) {
    console.log('entered post question open!');
    console.log(req.body);
    var sess = req.session;
    var sid = req.sessionID;
    
    var _id = req.body._id;
    var ret = {};
            
    Question.findOne({'_id': _id}, function (err, record) {
        if (err) return handleError(err);
        if (!record) {
            ret.status = "error";
            ret.errorno = 1;  //"this question does not exist."
            res.json(ret);
        }
        else{							   
            //return success
            ret.status = "success";
            ret.errorno = 0;  //success
            ret.body = record;
            res.json(ret);
        }
    }); 
 });

// delete a question
router.post('/delete', function(req, res) {
    console.log('entered post question delete!');
    console.log(req.body);
    var sess = req.session;
    var sid = req.sessionID;
    
    var _id = req.body._id;
    var ret = {};

    Question.remove({ "_id" : {$eq: _id} })
    .exec(function (err) {
            if(err) return handleError(err);  
            console.log('question deleted!');              
                    ret.status = "success";
                    ret.errorno = 0;
                    res.json(ret);  
    });
});


module.exports = router;
