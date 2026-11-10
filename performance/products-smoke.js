
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',

  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const resposta = http.get(
    `${__ENV.BASE_URL || 'http://api:3000'}/v1/product/search`
  );

  check(resposta, {
    'API respondeu com status 200': (res) => res.status === 200,
  });

  sleep(1);
}
