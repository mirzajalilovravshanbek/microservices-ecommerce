const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
// app.use(express.json());

const options = {
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
};

// Qo‘shimcha loglar (debug uchun)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy sozlamalari
app.use('/users', createProxyMiddleware({
  target: 'http://user-service:3101',
  changeOrigin: true,
  pathRewrite: (path, req) => path.replace(/^\/users/, ''),
  logLevel: 'debug', // 🔥 qo'shimcha loglar uchun
  ...options
}));

app.use('/products', createProxyMiddleware({
  target: 'http://product-service:3102',
  changeOrigin: true,
  pathRewrite: (path, req) => path.replace(/^\/products/, ''),
  logLevel: 'debug', // 🔥 qo'shimcha loglar uchun
  ...options
}));

app.use('/orders', createProxyMiddleware({
  target: 'http://order-service:3103',
  changeOrigin: true,
  pathRewrite: (path, req) => path.replace(/^\/orders/, ''),
  logLevel: 'debug', // 🔥 qo'shimcha loglar uchun
  ...options
}));


app.get('/', (req, res) => res.send('API Gateway: use /users, /products, /orders'));


app.listen(3000, () => console.log('API Gateway listening on 3000'));