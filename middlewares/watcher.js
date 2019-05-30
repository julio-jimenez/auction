//Another watcher

// const auction = require('../models/auction');
// const handler = require('../middlewares/handlers');

// const toClose = [];

// function twentySeconds() {
//   auction.find({ status: 'ongoing' }).then((resp) => {
//     console.log('THERE');
//     resp.forEach((element) => {
//       if ((element.endTime - Date.now()) < 20000 && !toClose.includes(element)) {
//         toClose.push(element);
//         console.log('added');
//       }
//     });
//   });
//   setTimeout(() => {
//     twentySeconds();
//   }, 10000);
// }

// function everySecond() {
//   if (toClose != NaN && toClose.length != 0) {
//     toClose.forEach((element) => {
//       console.log(element.endTime - Date.now());
//       if ((element.endTime - Date.now()) <= 0) {
//         console.log(element.endTime - Date.now());
//         handler.autoStop(element._id);
//         console.log(`stopped: ${element._id}`);
//         toClose.splice(toClose.indexOf(element), 1);
//       }
//     });
//   }
//   setTimeout(() => {
//     everySecond();
//   }, 1000);
// }

// twentySeconds();
// everySecond();
