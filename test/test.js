import { sleep, check } from 'k6';
import http from 'k6/http';

const randomInt = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min
const randomSleep = (min = 0, max = 10) => sleep(randomInt(min, max))

const thresholds = {
  'http_req_failed{endpoint:home}': ['rate==0'],
  'http_req_duration{endpoint:home}': ['p(95)<200'],

  'http_req_failed{endpoint:slow}': ['rate==0'],
  'http_req_duration{endpoint:slow}': ['p(95)<200'],

  'http_req_failed{endpoint:unreliable}': ['rate==0'],
  'http_req_duration{endpoint:unreliable}': ['p(95)<200'],

  'http_req_failed{endpoint:dangerous}': ['rate==0'],
  'http_req_duration{endpoint:dangerous}': ['p(95)<200'],
}

const unit = {
  thresholds,
  vus: 1,
  iterations: 1
}

const smoke = {
  thresholds,
  vus: 2,
  duration: '30s'
}

const load = {
  thresholds,
  stages: [
    // ramp up
    {
      target: 10,
      duration: '1m'
    },
    // hold
    {
      target: 10,
      duration: '2m'
    },
    // ramp down
    {
      target: 0,
      duration: '1m'
    }
  ]
}

const stress = {
  thresholds,
  stages: [
    // ramp up
    {
      target: 100,
      duration: '10m'
    },
    // hold
    {
      target: 100,
      duration: '30m'
    },
    // ramp down
    {
      target: 0,
      duration: '5m'
    }
  ]
}

const soak = {
  thresholds,
  stages: [
    // ramp up
    {
      target: 100,
      duration: '10m'
    },
    // hold
    {
      target: 100,
      duration: '8h'
    },
    // ramp down
    {
      target: 0,
      duration: '5m'
    }
  ]
}

const spike = {
  thresholds,
  stages: [
    // ramp up
    {
      target: 1000,
      duration: '2m'
    },
    // ramp down
    {
      target: 0,
      duration: '1m'
    }
  ]
}



export const options = load
// unit
// smoke
// load
// stress
// soak
// spike

const get_home = () => {
  const res = http.get('http://localhost:8000', { tags: { endpoint: 'home' } });
  check(res, {
    'status was 200': (r) => r.status == 200,
  })
}

const get_slow = () => {
  const res = http.get('http://localhost:8000/slow', { tags: { endpoint: 'slow' } });
  check(res, {
    'status was 200': (r) => r.status == 200,
  })
}

const get_unreliable = () => {
  const res = http.get('http://localhost:8000/unreliable', { tags: { endpoint: 'unreliable' } });
  check(res, {
    'status was 200': (r) => r.status == 200,
  })
}

const get_dangerous = () => {
  const res = http.get('http://localhost:8000/dangerous', { tags: { endpoint: 'dangerous' } });
  check(res, {
    'status was 200': (r) => r.status == 200,
  })
}

export default () => {
  const choice = randomInt(1, 4)

  switch (choice) {
    case 1:
      get_home()
      break;

    case 2:
      get_slow()
      break;

    case 3:
      get_unreliable()
      break;

    case 4:
      get_dangerous()
      break;

    default:
      break;
  }

  // randomSleep(1, 3);
}