const IPFS = require('ipfs')
const assert = require('chai').assert
const createRequest = require('../index.js').handle
var node;
var test_x;
var test_y;
var data1_hash;

async function testing() {
  try {
    const node = await IPFS.create()
  } catch (error){
    console.log('That did not go well.')
    process.exit(1)
  }
  test_y = node.add('./x_test.txt')
  test_x = node.add('./y_test.txt')
  data1_hash = node.add(['./ires_train_1.txt'])
}

describe('createRequest', () => {
  const jobID = '1'
  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { test_x: test_x, test_y: test_y, training_hash_array: data1_hash } } },
      { name: 'test 1', testData: { id: jobID, data: { test_x: test_x, test_y: test_y, training_hash_array: data1_hash } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'base not supplied', testData: { id: jobID, data: { quote: 'USD' } } },
      { name: 'quote not supplied', testData: { id: jobID, data: { base: 'ETH' } } },
      { name: 'unknown base', testData: { id: jobID, data: { base: 'not_real', quote: 'USD' } } },
      { name: 'unknown quote', testData: { id: jobID, data: { base: 'ETH', quote: 'not_real' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
