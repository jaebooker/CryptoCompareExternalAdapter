let request = require('request');
const path = require('path');
var util = require("util");
//import * as tf from '@tensorflow/tfjs';
//const {spawn} = require('child_process');
//const IPFS = require('ipfs')
const axios = require('axios');
//const API_URL = 'https://ipfs.infura.io:5001/api/v0/object/get?arg='
var spawn = require("child_process").spawn;
var API_URL = 'https://ipfs.io/ipfs/'
//async function main(data, callback) {
// function makeAPICall(path, callback) {
//   // Attempt to make API call to path argument.
//   // ...
//   callback(undefined, res); // Or, callback(err, undefined); depending upon the API’s response.
// }
const handle = (data, callback) => {
  var results = [];
  var test_x_model = "";
  var test_y_model = "";
  const test_x_api = API_URL.concat(data.data.test_x_hash);
  const test_y_api = API_URL.concat(data.data.test_y_hash);

  axios.get(test_x_api)
    .then(response => {
        test_x_model = response;
        axios.get(test_y_api)
          .then(response => {
              test_y_model = response;
              for (var i =0; i < data.data.training_hash_array.length; i++){
                console.log("things are about to get a little... LOOP-y!")
                //test_x_model = test_x_model.concat('./test/y_test.txt');
                //test_y_model = test_y_model.concat('./test/y_test.txt');
                const training_api = API_URL.concat(data.data.training_hash_array[i]);
                axios.get(training_api)
                  .then(response => {
                      var training_model = response
                      var process = spawn('python3',["./keras.py",
                                            training_model,
                                            test_x_model, test_y_model] );
                      process.stdout.on('data', (data) => {
                        console.log("we cool")
                        console.log(`stdout: ${data}`);
                      });

                      process.stderr.on('data', (data) => {
                        console.log("we not cool")
                        console.error(`stderr: ${data}`);
                      });

                      process.on('close', (code) => {
                        results.push(code);
                        console.log("these be the results")
                        console.log(results[0])
                      });
                  })
                  .catch(error => console.log("oh dear, we are in trouble"));
              }
          })
          .catch(error => console.log("oh dear, we are in trouble"));
    })
    .catch(error => console.log("oh dear, we are in trouble"));
  return results;
}
// const node = await IPFS.create()
// var results;
// var test_x_model = '';
// var test_y_model = '';
// const test_x_stream = node.cat(data.test_x_hash);
// const test_y_stream = node.cat(data.test_y_hash);
// for await (const chunk of test_x_stream) {
//   test_x_model += chunk.toString()
// }
// for await (const chunk of test_y_stream) {
//   test_y_model += chunk.toString()
// }
//
// for (var i =0; len(data.training_hash_array); i++){
//   var training_model = '';
//   const training_stream = node.cat(data.training_hash_array[i]);
//
//   for await (const chunk of training_stream) {
//     training_model += chunk.toString()
//   }
//   var process = spawn('python',["./keras.py",
//                         training_model,
//                         test_x_model, test_y_model] );
//
//   process.stdout.on('training_model', (training_model) => {
//     console.log(`stdout: ${training_model}`);
//   });
//
//   process.stderr.on('training_model', (training_model) => {
//     console.error(`stderr: ${training_model}`);
//   });
//
//   process.on('close', (code) => {
//     results.append(code);
//     console.log(results)
//     return results;
//   });
// };
// }
//
//
// let handle = (data, callback) => {
//   main(data, callback);
// };

exports.handler = (event, callback) => {
    let data = {
        id: event.id || "2",
        endpoint: event.data.endpoint || "",
        test_x_hash: event.test_x_hash,
        test_y_hash: event.test_y_hash,
        training_hash_array: event.training_hash_array
    };

    handle(data, (statusCode, responseData) => {
        callback(null, responseData);
    });
};
module.exports.handle = handle
