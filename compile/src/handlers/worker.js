const { processJob } = require("../controllers/job")
const { compileLog } = require("../utils/base")

const Queue = require("bull")
const redisUrlParse = require("redis-url-parse")

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL =
  process.env.REDIS_URL ||
  process.env.REDISCLOUD_URL ||
  "redis://compile_queue:6379"

const { host, port, password } = redisUrlParse(REDIS_URL)
const bullOptions = REDIS_URL.includes("rediss://")
  ? {
      redis: {
        port: Number(port),
        host,
        password,
        tls: {
          rejectUnauthorized: false,
          requestCert: true,
          agent: false,
        },
      },
    }
  : REDIS_URL
// The maximum number of jobs each worker should process at once
// Each job is CPU-intensive, so this value should not be too high
const maxJobsPerWorker = process.env.JOB_CONCURRENCY || 1
compileLog(JSON.stringify(bullOptions))
module.exports.init = () => {
  // starting up the service
  compileLog("Starting compile cluster")
}

module.exports.start = id => {
  // Signal worked started
  compileLog(`Started worker ${id}`)

  // Connect to the named queue
  const compile_queue = new Queue("submissions", bullOptions)
  compile_queue.on("error", err => {
    compileLog(JSON.stringify(err))
  })
  // start processing jobs from the submission queue
  compile_queue.process(maxJobsPerWorker, processJob)
}
