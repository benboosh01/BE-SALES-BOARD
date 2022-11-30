const request = require('supertest');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require('../app');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('GET /api/sales_types', () => {
  test('status 200: responds with object with correct keys', () => {
    return request(app)
      .get('/api/sales_types')
      .expect(200)
      .then(({ body }) => {
        expect(body.salesTypes.length).toBe(2);
        body.salesTypes.forEach((salesType) => {
          expect(salesType).toHaveProperty('sales_type');
        });
      });
  });
});

describe('GET /api/organisations', () => {
  test('status 200: responds with object with correct keys', () => {
    return request(app)
      .get('/api/organisations')
      .expect(200)
      .then(({ body }) => {
        expect(body.organisations.length).toBe(1);
        body.organisations.forEach((organisation) => {
          expect(organisation).toHaveProperty('organisation_name');
        });
      });
  });
});

describe('GET /api/users', () => {
  test('status 200: responds with object with correct keys', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(14);
        body.users.forEach((user) => {
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('first_name');
          expect(user).toHaveProperty('surname');
          expect(user).toHaveProperty('level');
          expect(user).toHaveProperty('team');
          expect(user).toHaveProperty('organisation');
        });
      });
  });
  test('status 200: responds with object with single user when query added', () => {
    return request(app)
      .get('/api/users?username=fred123')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(
          expect.objectContaining({
            username: 'fred123',
            first_name: 'Frederick',
            surname: 'Burns',
            level: 1,
            team: 'Katya Barry',
            organisation: 'Computer Sales Superstore',
          })
        );
      });
  });
  test('status 200: responds with object with single user when query added', () => {
    return request(app)
      .get('/api/users?first_name=Frederick')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(
          expect.objectContaining({
            username: 'fred123',
            first_name: 'Frederick',
            surname: 'Burns',
            level: 1,
            team: 'Katya Barry',
          })
        );
      });
  });
  test('status 200: responds with object with single user when query added', () => {
    return request(app)
      .get('/api/users?surname=Burns')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(
          expect.objectContaining({
            username: 'fred123',
            first_name: 'Frederick',
            surname: 'Burns',
            level: 1,
            team: 'Katya Barry',
            organisation: 'Computer Sales Superstore',
          })
        );
      });
  });
  test('status 200: responds with object with single user when query added', () => {
    return request(app)
      .get('/api/users?level=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(2);
        expect(body.users[0]).toEqual(
          expect.objectContaining({
            username: 'katya123',
            first_name: 'Katya',
            surname: 'Barry',
            level: 2,
            team: 'Sales',
            team: 'Bonitus Mars',
          })
        );
      });
  });
});

describe('GET /api/sales', () => {
  test('status200: responds with object with correct keys', () => {
    return request(app)
      .get('/api/sales')
      .expect(200)
      .then(({ body }) => {
        expect(body.sales.length).toBe(22);
        body.sales.forEach((salesEntry) => {
          expect(salesEntry).toHaveProperty('sales_entry_id');
          expect(salesEntry).toHaveProperty('sales_date');
          expect(salesEntry).toHaveProperty('sales_user');
          expect(salesEntry).toHaveProperty('sales_number');
          expect(salesEntry).toHaveProperty('sales_type');
        });
      });
  });
  test('status 200: responds with correct user and sales type ordered by date ASC', () => {
    return request(app)
      .get('/api/sales?sales_user=fred123&sales_type=hardware')
      .expect(200)
      .then(({ body }) => {
        expect(body.sales.length).toBe(1);
        expect(body.sales[0]).toEqual(
          expect.objectContaining({
            first_name: 'Frederick',
            surname: 'Burns',
            team: 'Katya Barry',
            username: 'fred123',
            level: 1,
            organisation: 'Computer Sales Superstore',
            sales_entry_id: 1,
            sales_date: expect.any(String),
            sales_user: 'fred123',
            sales_number: 4,
            sales_type: 'hardware',
          })
        );
      });
  });
  test('status 200: responds with correct sales type ordered by sales_number DESC', () => {
    return request(app)
      .get('/api/sales?sales_type=hardware')
      .expect(200)
      .then(({ body }) => {
        expect(body.sales.length).toBe(11);
        expect(body.sales[0]).toEqual(
          expect.objectContaining({
            first_name: 'Frederick',
            surname: 'Burns',
            team: 'Katya Barry',
            username: 'fred123',
            level: 1,
            organisation: 'Computer Sales Superstore',
            sales_entry_id: 1,
            sales_date: expect.any(String),
            sales_user: 'fred123',
            sales_number: 4,
            sales_type: 'hardware',
          })
        );
      });
  });
});

describe('POST /api/users', () => {
  test('status 201: succesfully adds user and responds with new user object', () => {
    const newUser = {
      username: 'andy123',
      first_name: 'Andy',
      surname: 'Williamson',
      level: 1,
      team: 'Katya Barry',
      organisation: 'Computer Sales Superstore',
    };
    return request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual(newUser);
      });
  });
  test('status 400: responds with error when request missing data', () => {
    const newUser = {
      username: 'wrong123',
      first_name: 'wrong',
      surname: 'user',
      level: 1,
      team: 'Katya Barry',
    };
    return request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'missing user details - all fields must be completed'
        );
      });
  });
  test('status 400: responds with error when request data entered is wrong type', () => {
    const newUser = {
      username: 'wrong123',
      first_name: 'wrong',
      surname: 'user',
      level: 'ten',
      team: 'Katya Barry',
      organisation: 'Computer Sales Superstore',
    };
    return request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid input');
      });
  });
});

describe('PATCH /api/sales', () => {
  test('status 201: succesfully completes request and responds with updated sales number', () => {
    const patch = {
      sales_user: 'fred123',
      sales_date: '28/11/2022',
      sales_type: 'hardware',
      inc_sales: 1,
    };
    return request(app)
      .patch('/api/sales')
      .send(patch)
      .expect(200)
      .then(({ body }) => {
        expect(body.salesEntry).toEqual(
          expect.objectContaining({
            sales_entry_id: 1,
            sales_date: '28/11/2022',
            sales_user: 'fred123',
            sales_number: 5,
            sales_type: 'hardware',
          })
        );
      });
  });
  test('status 201: succesfully completes negative number request and responds with updated sales number', () => {
    const patch = {
      sales_user: 'fred123',
      sales_date: '28/11/2022',
      sales_type: 'hardware',
      inc_sales: -1,
    };
    return request(app)
      .patch('/api/sales')
      .send(patch)
      .expect(200)
      .then(({ body }) => {
        expect(body.salesEntry).toEqual(
          expect.objectContaining({
            sales_entry_id: 1,
            sales_user: 'fred123',
            sales_date: '28/11/2022',
            sales_type: 'hardware',
            sales_number: 3,
          })
        );
      });
  });
  test('status 404: responds with error when sales entry can not be found', () => {
    const patch = {
      sales_user: 'fred123',
      sales_date: '29/11/2022',
      sales_type: 'hardware',
      inc_sales: 1,
    };
    return request(app)
      .patch('/api/sales')
      .send(patch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('sales_date 29/11/2022 not found');
      });
  });
  test('status 404: responds with error when user does not exist', () => {
    const patch = {
      sales_user: 'iDontExist',
      sales_date: '28/11/2022',
      sales_type: 'cable',
      inc_sales: 1,
    };
    return request(app)
      .patch('/api/sales')
      .send(patch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('username iDontExist not found');
      });
  });
  test('status 404: responds with error when sales type does not exist', () => {
    const patch = {
      sales_user: 'fred123',
      sales_date: '28/11/2022',
      sales_type: 'special',
      inc_sales: 1,
    };
    return request(app)
      .patch('/api/sales')
      .send(patch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('sales_type special not found');
      });
  });
});

describe('POST /api/sales', () => {
  test('status 201: succesfully completes request and returns with sales data', () => {
    const salesEntry = {
      sales_date: '29/11/2022',
      sales_user: 'fred123',
      sales_number: 4,
      sales_type: 'hardware',
    };
    const response = {
      sales_entry_id: 23,
      sales_date: '29/11/2022',
      sales_user: 'fred123',
      sales_number: 4,
      sales_type: 'hardware',
    };
    return request(app)
      .post('/api/sales')
      .send(salesEntry)
      .expect(201)
      .then(({ body }) => {
        expect(body.salesEntry).toEqual(response);
      });
  });
  test('status 400: responds with error when missing data from request', () => {
    const salesEntry = {
      sales_date: '29/11/2022',
      sales_user: 'fred123',
      sales_number: 4,
    };
    return request(app)
      .post('/api/sales')
      .send(salesEntry)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'missing sales details - all fields must be completed'
        );
      });
  });
  test('status 400: responds with error when wrong data type sent', () => {
    const salesEntry = {
      sales_date: '29/11/2022',
      sales_user: 'fred123',
      sales_number: 'three',
      sales_type: 'hardware',
    };
    return request(app)
      .post('/api/sales')
      .send(salesEntry)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid input');
      });
  });
  test('status 404: responds with error when user does not exist', () => {
    const salesEntry = {
      sales_date: '29/11/2022',
      sales_user: 'imposter',
      sales_number: 4,
      sales_type: 'hardware',
    };
    return request(app)
      .post('/api/sales')
      .send(salesEntry)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('username not found');
      });
  });
});

describe('PATCH /api/users', () => {
  test('status 201: updates user details when passed one change', () => {
    const userUpdate = {
      first_name: 'Fred',
      username: 'fred123',
    };
    return request(app)
      .patch('/api/users')
      .send(userUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: 'fred123',
            first_name: 'Fred',
            surname: 'Burns',
            level: 1,
            team: 'Katya Barry',
            organisation: 'Computer Sales Superstore',
          })
        );
      });
  });
  test('status 201: updates user details when passed two changes', () => {
    const userUpdate = {
      first_name: 'Fred',
      surname: 'Harris',
      username: 'fred123',
    };
    return request(app)
      .patch('/api/users')
      .send(userUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: 'fred123',
            first_name: 'Fred',
            surname: 'Harris',
            level: 1,
            team: 'Katya Barry',
            organisation: 'Computer Sales Superstore',
          })
        );
      });
  });
  test('status 201: updates user details when passed three changes', () => {
    const userUpdate = {
      first_name: 'Fred',
      surname: 'Harris',
      level: 2,
      username: 'fred123',
    };
    return request(app)
      .patch('/api/users')
      .send(userUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: 'fred123',
            first_name: 'Fred',
            surname: 'Harris',
            level: 2,
            team: 'Katya Barry',
            organisation: 'Computer Sales Superstore',
          })
        );
      });
  });
  test('status 404: responds with error if wrong data type entered', () => {
    const userUpdate = {
      first_name: 'Fred',
      surname: 'Harris',
      level: 'three',
      username: 'fred123',
    };
    return request(app)
      .patch('/api/users')
      .send(userUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid input');
      });
  });
  test('status 404: responds with error if user does not exist', () => {
    const userUpdate = {
      first_name: 'Fred',
      surname: 'Harris',
      level: 1,
      username: 'freddy1000',
    };
    return request(app)
      .patch('/api/users')
      .send(userUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('username freddy1000 not found');
      });
  });
});
