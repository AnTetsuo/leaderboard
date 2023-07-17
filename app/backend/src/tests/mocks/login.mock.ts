export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhc2RodXciLCJpYXQiOjE2ODk2MjI1MDB9.3M2QFwumqtt0FyMRWAbjL-PZTlQzi-bdx6whYzjeraI'

export const authHeader = 'Bearer ' + token;

export const user = {
  id: 1,
  username: 'abcd',
  email: 'asdhuw',
  role: 'not',
  password: 'yeetee',
}

export const payload = {
  email: 'abcdefgh@hgfedcba.com',
  password: 'yeetee',
}

export const invEmail = {
  email: '@invalid.com',
  password: '123456',
}

export const invPassword = {
  email: 'valid@email.com',
  password: '12345',
}

