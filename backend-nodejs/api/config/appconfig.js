// Global App Configuration
module.exports = {
  FRONTEND_URI: process.env.FRONTEND_URI || 'http://localhost:4200/',
  SECRET: '52FCgVGa9_@4pel7DslfgTbDowf7KxDIBxyAIfr5tWI0CL',
  MONGO_URI:
  process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/StartUp-Connect-Database-test' : 'mongodb://localhost:27017/StartUp-Connect-Database',
  CERT_Path: 'ssl/cert.pem',
  CERT_KEY_Path: 'ssl/key.pem',
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};