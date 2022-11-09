const { createProxyMiddleware } = require('http-proxy-middleware');

// Allows us to use api endpoints from the backend simply by using a path /api/{backend route}
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};