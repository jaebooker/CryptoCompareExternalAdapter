let request = require('request');
const path = require('path');
const {spawn} = require('child_process');
const IPFS = require('ipfs')
//async function main(data, callback) {
const handle = async (data, callback) => {
const node = await IPFS.create()
var results;
var test_x_model = '';
var test_y_model = '';
const test_x_stream = node.cat(data.test_x_hash);
const test_y_stream = node.cat(data.test_y_hash);
for await (const chunk of test_x_stream) {
  test_x_model += chunk.toString()
}
for await (const chunk of test_y_stream) {
  test_y_model += chunk.toString()
}

for (var i =0; len(data.training_hash_array); i++){
  var training_model = '';
  const training_stream = node.cat(data.training_hash_array[i]);

  for await (const chunk of training_stream) {
    training_model += chunk.toString()
  }
  var process = spawn('python',["./keras.py",
                        training_model,
                        test_x_model, test_y_model] );

  process.stdout.on('training_model', (training_model) => {
    console.log(`stdout: ${training_model}`);
  });

  process.stderr.on('training_model', (training_model) => {
    console.error(`stderr: ${training_model}`);
  });

  process.on('close', (code) => {
    results.append(code);
    console.log(results)
    return results;
  });
};
}
//
// let handle = (data, callback) => {
//   main(data, callback);
// };

exports.handler = (event, callback) => {
    let data = {
        id: event.id,
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
