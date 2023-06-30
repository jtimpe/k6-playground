# k6-playground

## setup

Start the backend
```bash
cd path/to/k6-playground

cd app/
docker-compose up
```

In another terminal:

Install k6
```bash
brew install k6
```

Run the test
```bash
cd path/to/k6-playground

cd test
k6 run ./test.js
```

## walkthrough

### Backend application

The backend is a [flask](https://flask.palletsprojects.com/en/2.3.x/) application. `app/app.py` contains implementation for the following routes:
* `/`
* `/slow`
* `/unreliable`
* `/dangerous`

### K6 tests

Performance tests are written using [k6](https://k6.io/docs/). `test/test.js` is the main test file. The `default` function exported at the bottom of the file is the test scenario; each "`vu`" (virtual user) will execute this function, which randomly selects a backend endpoint and makes a request. Each run of the function counts as one "iteration", and a vu will perform iterations for the `duration` of the test.

Above the endpoint implementation, a number of load test scenarios are defined. Changing the `options` variable changes the test type. The test types included in the file are:
* `unit` - single request, debugging
* `smoke` - very light load, are things functioning?
* `load` - assess how the system performs under average load (~80% of peak) `stress` - assess performance under higher-than-average load (~100% of peak)
* `soak` - assess long-term reliability and performance
* `spike` - assess performance under extreme conditions, sudden massive increase in traffic

Read more about [k6 test types](https://k6.io/docs/test-types/load-test-types/)