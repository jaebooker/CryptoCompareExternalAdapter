let request = require('request');
const path = require('path');
const {spawn} = require('child_process');
// const ls = spawn('ls', ['-lh', '/usr']);
const node = await IPFS.create()
let handle = (data, callback) => {
    var results;
    var test_x_model;
    var test_y_model;
    const test_x_stream = node.cat(data.test_x_hash);
    const test_y_stream = node.cat(data.test_y_hash);
    for await (const chunk of test_x_stream) {
      test_x_model += chunk
    }
    for await (const chunk of test_y_stream) {
      test_y_model += chunk
    }
    // let url = "https://ipfs.infura.io:5001/api/v0/object/stat?arg=";
    for i in range(0, len(data.training_model_hash)):
      //url = url + data[i]
      var training_model;
      const training_stream = node.cat(data.training_model_hash[i]);

      for await (const chunk of training_stream) {
        training_model += chunk
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
      });
    // let requestObj;

    // switch (data.endpoint) {
    //     case "price":
    //         requestObj = {
    //             fsym: data.fsym,
    //             tsyms: data.tsyms
    //         };
    //         break;
    //     case "pricemulti":
    //     case "pricemultifull":
    //         requestObj = {
    //             fsyms: data.fsyms,
    //             tsyms: data.tsyms
    //         };
    //         break;
    //     case "generateAvg":
    //         requestObj = {
    //             fsym: data.fsym,
    //             tsym: data.tsym,
    //             e: data.exchange
    //         };
    //         break;
    //     default:
    //         requestObj = {
    //             fsym: data.fsym,
    //             tsyms: data.tsyms
    //         };
    //         break;
    // }

    // let options = {
    //     url: url,
    //     qs: requestObj,
    //     json: true
    // };

    // request(options, (error, response, body) => {
    //     if (error || response.statusCode >= 400) {
    //         callback(response.statusCode, {
    //             jobRunID: data.id,
    //             status: "errored",
    //             error: error
    //         });
    //     } else {
    //         let resp = body;
    //         if (data.endpoint === "price")
    //             resp.result = resp[data.tsyms];
    //
    //         callback(response.statusCode, {
    //             jobRunID: data.id,
    //             data: body
    //         });
    //     }
    // });
};

exports.handler = (event, context, callback) => {
    let data = {
        id: event.id,
        endpoint: event.data.endpoint || "",
        fsyms: event.data.fsyms || "",
        fsym: event.data.coin || event.data.fsym || "",
        tsyms: event.data.market || event.data.tsyms || "",
        tsym: event.data.tsym || "",
        exchange: event.data.exchange || ""
    };

    handle(data, (statusCode, responseData) => {
        callback(null, responseData);
    });
};

// exports.gcpservice = (req, res) => {
//     let data = {
//         id: req.body.id,
//         endpoint: req.body.data.endpoint || "price",
//         fsyms: req.body.data.fsyms || "",
//         fsym: req.body.data.coin || req.body.data.fsym || "",
//         tsyms: req.body.data.market || req.body.data.tsyms || "",
//         tsym: req.body.data.tsym || "",
//         exchange: req.body.data.exchange || ""
//     };
//
//     handle(data, (statusCode, responseData) => {
//         res.status(statusCode).send(responseData);
//     });
// };
