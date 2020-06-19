//const IPFS = require('ipfs')
const assert = require('chai').assert
const createRequest = require('../index.js').handle
//var node;
// async function testing() {
//   const node = IPFS.create()
//   var nodeStream = node.then(function(node) {
//     if(node != None) {
//       test_y = node.add('./x_test.txt')
//       test_x = node.add('./y_test.txt')
//       data1_hash = node.add(['./ires_train_1.txt'])
//     } else {
//       console.log("nill")
//     }
//   })
//   await Promise.all(node)
// }

describe('createRequest', () => {
  console.log("so it begins")
  const jobID = '1';
  const test_x = "QmQinckAgM5U9JFVeaV5iUcHapP6kJAyFinR63zgAfw4Xs?filename=x_test.txt"
  const test_y = "QmcPfY9EMR5Fkj15Xjsi4s2rTUTX3geV7p5A4Qqnp7nRsy?filename=y_test.txt"
  const data1_hash_hash = "QmaHFsFav5EHWcwNo17GoWHqUVwx9w8CUKftgqbb6PGHfk?filename=ires_train_1.txt"
  var data1_hash = [];
  //testing();
  context('successful calls', () => {
    data1_hash.push(data1_hash_hash)
    const requests = [
      { name: 'id not supplied', testData: { data: { id: jobID, test_x_hash: test_x, test_y_hash: test_y, training_hash_array: data1_hash } } },
      { name: 'test 1', testData: { data: { id: jobID, test_x_hash: test_x, test_y_hash: test_y, training_hash_array: data1_hash } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        console.log("requesting data")
        createRequest(req.testData, (statusCode, data) => {
          //this.timeout(5000000);
          assert.equal(statusCode, 200)
          //assert.equal(data.data.ID, jobID)
          assert.isNotEmpty(data)
          // assert.isAbove(Number(data.data.result), 0)
          // assert.isAbove(Number(data.data.result), 0)
          done()
        })
      }).timeout(2000)
    })
  })

  // context('error calls', () => {
  //   const requests = [
  //     { name: 'empty body', testData: {} },
  //     { name: 'empty data', testData: { data: {} } },
  //     { name: 'base not supplied', testData: { id: jobID, data: { quote: 'USD' } } },
  //     { name: 'quote not supplied', testData: { id: jobID, data: { base: 'ETH' } } },
  //     { name: 'unknown base', testData: { id: jobID, data: { base: 'not_real', quote: 'USD' } } },
  //     { name: 'unknown quote', testData: { id: jobID, data: { base: 'ETH', quote: 'not_real' } } }
  //   ]
  //
  //   requests.forEach(req => {
  //     it(`${req.name}`, (done) => {
  //       createRequest(req.testData, (statusCode, data) => {
  //         assert.equal(statusCode, 500)
  //         assert.equal(data.jobRunID, jobID)
  //         assert.equal(data.status, 'errored')
  //         assert.isNotEmpty(data.error)
  //         done()
  //       })
  //     })
  //   })
  // })
})
