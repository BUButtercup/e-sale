const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

  // find all categories
  // be sure to include its associated Products

// get all categories
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const categoryData = await Category.findAll({
      include: [{ 
        model: Product,
        attributes: ['product_name'],
      }],
    })
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


  // find one category by its `id` value
  // be sure to include its associated Products
  router.get('/:id', async (req, res) => {
    try{
      const categoryData = await Category.findByPk(req.params.id, {
        include: [{ 
          model: Product,
          attributes: ['product_name'],
        }],
      })
      if(!categoryData){
        res.status(404).json({message: 'No category found with that id'});
        return;
      }
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err)
    }
  });

router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      category_name:''
    }
  */
  try {
      const categoryData = await Category.create(req.body)
      res.status(200).json(categoryData);
  } catch(err) {
      console.log(err);
      res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    if(category){
      res.status(200).json({message: 'Category has been updated!'});
    }
  } catch (err) {
    res.status(500).json({message: 'There was an error:', err})
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const category = await Category.destroy({where: {id: req.params.id}
    })
    if(category){
      res.status(200).json({message: 'Category has been deleted!'});
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({message: 'There was an error:', err})
  }
});


module.exports = router;
