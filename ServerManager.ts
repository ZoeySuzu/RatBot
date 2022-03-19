/**
*  ZS 19/03/22
*  This function will create a replit server that is constantly pinged by 
*  uptimeRobot, as otherwise the bot would stop running after an hour. 
*  Although may not be necessary.
**/
import express from 'express';

export function InitiateServer(){
  //Start bot server
  const app = express();
  app.get('/', (req, res) => {
    res.send('hello world')
  })

  app.listen(3000)
}