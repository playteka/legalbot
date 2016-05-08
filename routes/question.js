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


//check the email format
var isemail = function(str) {   
    var re = /^([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+@([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+.[a-za-z]{2,3}$/;   
    return re.test(str);   
};  

// send the email in the end of the question
router.post('/sendmail', function(req, res) {
    console.log('entered post question sendemail!');
    console.log(req.body);
    var sess = req.session;
    var sid = req.sessionID;
    
    var end = req.body.question;
    var contact_email = req.body.contact_email;
    var ret = {};
    
    //if the email format is incorrect, return error    
    if(!isemail(contact_email)){
        ret.status = 'error'
        ret.errorno = 1; //the email format is incorrect.
        res.json(ret);
    }
            
    Question.findOne({'question': end}, function (err, record) {
        if (err) return handleError(err);
        if (!record) {
            ret.status = "error";
            ret.errorno = 2;  //"this question does not exist."
            res.json(ret);
        }
        else{
            
            var nodemailer = require("nodemailer");
            var smtpTransport = require('nodemailer-smtp-transport');

            // 开启一个 SMTP 连接池
            var transport = nodemailer.createTransport(smtpTransport({
            host: "smtp.qq.com", // 主机
            secure: true, // 使用 SSL
            port: 465, // SMTP 端口
            auth: {
                user: "914238649@qq.com", // 账号
                pass: "Huanyu@0519" // 密码
            }
            }));

            // 设置邮件内容
            var mailOptions = {
            from: "RegulationBot <914238649@qq.com>", // 发件地址
            to: contact_email, // 收件列表
            subject: "Answer from RegulationBot", // 标题
            html: record.email // email 内容
            }

            // 发送邮件
            transport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.error(error);
                    //return error
                    ret.status = "error";
                    ret.errorno = 3;  //fail to send email
                    res.json(ret);
                } else {
                    console.log(response);
                    //return success
                    ret.status = "success";
                    ret.errorno = 0;  //success
                    res.json(ret);
                }
            transport.close(); // 如果没用，关闭连接池
            });                      							   
        }
    }); 
 });

module.exports = router;
