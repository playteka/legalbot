var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Question = require('../db/schema.js').Question;

var async = require('async');

router.get('/combot.xml', function (req, res) {
    console.log('entered botxml!');
    var data={};
           
    async.waterfall([
        function(callback){
           Question.find({ question: new RegExp("^Q") })
           .select('_id question yes no')
           .exec(function(err, question_list){
               console.log('found question list!');
               console.log(question_list);
               if (err) return next(err);
                 callback(err,question_list);
            });  
        },
        function(question_list, callback){
           Question.find({ question: new RegExp("^E") })
           .select('_id question yes no')
           .exec(function(err, end_list){
               console.log('found End list!');
               console.log(end_list);
               if (err) return next(err);
                 callback(err,[question_list,end_list]);
            });  
        }],
        // final callback
        function(err, results){
            // results is ['a', 'b', 'c', 'd']
            // final callback code
            console.log(results);
            data.questions = results[0];
            data.ends = results[1];
            res.render('botxml', data);            
        }
     );
        

           
 });
 
 
 module.exports = router;