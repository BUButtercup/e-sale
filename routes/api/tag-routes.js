const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint


// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {

  try {
    const tagData = await Tag.findAll({
      include: [{ 
        model: Product,
        attributes: ['product_name'],
      }],
    })
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ 
        model: Product,
        attributes: ['product_name'],
      }],
    })
    if(!tagData){
      res.status(404).json({message: 'No category found with that id'});
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});


// create a new tag
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      tag_name:''
    }
  */
  try {
      const tagData = await Tag.create(req.body)
      res.status(200).json(tagData);
  } catch(err) {
      console.log(err);
      res.status(400).json(err);
  }
});


router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const product = await Tag.update(req.body, {
      
      where: {
        id: req.params.id,
      },
    })
    if(product){
      res.status(200).json({message: 'Tag name successfully updated!'})
    } else {
      res.status(404).json({message: 'Tag with that ID not found'})
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'There was an error!', err})
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{
    const tag = await Tag.destroy({where: {id: req.params.id}
    })
    if(tag){
      
      res.status(200).json({message: 'Tag has been deleted!'});
    }else {
      res.status(404).json({message: 'Tag with that ID not found'})
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({message: 'There was an error:', err})
  }
});

module.exports = router;
