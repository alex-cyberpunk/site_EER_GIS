const nodeSchedule = require('node-schedule');
const sendEmail = require('../reqEmail/sendEmail.js');

const date = new Date(2020, 11, 31, 23);

const job = nodeSchedule.scheduleJob(date, () => {
  console.log('Happy new year!');
  // Realize an query to get the users that have a pending to approve areas

  //Query the get the map and obtain data 
  
  //Get the users and the days between the date of the request and the current date
  
  //If more then one day send an email to the user

});

job.nextInvocation().toString();