const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.send("<h1>Welcome to e-sale!</h1><br><p>You can view all products by appending <pre>/api/products</pre></p><br><p>You can view a single product by appending <pre>/api/products/:id</pre></p><br><p>You can view all categories by appending <pre>/api/categories</pre></p><br><p>You can view a single category by appending <pre>/api/categories/:id</pre></p><br><p>You can view all tags by appending <pre>/api/tags</pre></p><br><p>You can view a single tag by appending <pre>/api/tags/:id</pre></p><br><p>Please open your favorite api platform to test the rest of the routes!</p>")
});

module.exports = router;