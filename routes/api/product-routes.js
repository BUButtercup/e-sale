const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{ 
        model: Category,
        attributes: ['category_name'],
      },{
        model: Tag,
        attributes: ['tag_name']
      }],
    })
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{ 
        model: Category,
        attributes: ['category_name'],
      },{
        model: Tag,
        attributes: ['tag_name']
      }],
    })
    if(!productData){
      res.status(404).json({message: 'No product found with that id'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id:
      tagIds: [1, 2, 3, 4]
    }
  */
      const productData = await Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try{
      const product = await Product.update(req.body, {
        
        where: {
          id: req.params.id,
        },
      })
      if(product){
        // find all associated tags from ProductTag
        const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

        // get list of current tag_ids
        if(productTags.length>0){
          console.log('===========productTag length>0==============')
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          // create filtered list of new tag_ids
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
          if(newProductTags.length>0){
            console.log('===========newProductTag length>0==============')
          // figure out which ones to remove
            const productTagsToRemove = productTags
              .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
              .map(({ id }) => id);
            // run both actions
            const editedProductTags = await Promise.all([
              ProductTag.destroy({ where: { id: productTagsToRemove } }),
              ProductTag.bulkCreate(newProductTags),
            ]);
            res.status(200).json(editedProductTags)
          } else if ((newProductTags.length===0)||(productTags.length===0)){
            console.log('===========newProductTag length===0==============')
            const updatedProduct = await Product.findByPk(req.params.id, {
              include: [{ 
                model: Category,
                attributes: ['category_name'],
              },{
                model: Tag,
                attributes: ['tag_name']
              }],
            })
            res.status(200).json(updatedProduct)
          }
        }
      } else {
        res.status(404).json({message: 'No product with that id found.'})
      }
      // .then((updatedProductTags) => res.json(updatedProductTags))
  } catch(err){
      // console.log(err);
      res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if(!productData){
      res.status(404).json({message: 'No product found with that ID'});
      return
    }
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
