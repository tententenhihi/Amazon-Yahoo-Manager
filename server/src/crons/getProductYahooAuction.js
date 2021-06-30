import cron from 'cron';
import YahooAccountSchema from '../models/YahooAccount';
import QueueLoginYahooAuction from '../services/QueueLoginYahooAuction';
const job = new cron.CronJob({
  cronTime: '*/30 * * * *',
  onTick: async function() {
    console.log("Start cronjob")
    // let accounts = await YahooAccountSchema.find();
    // for (let index = 0; index < accounts.length; index++) {
    //   const element = accounts[index];
    //   QueueLoginYahooAuction.addNew(element)
    // }
    console.log('Cron jub runing...');
  },
  start: true, 
  timeZone: 'Asia/Tokyo'
});

export default job;
