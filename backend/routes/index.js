var express = require('express');
const Habit = require('../models/Habit');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hello page. */
router.get('/hello', function(req, res, next){
  res.json({"message":"hello mom!"});
})


/* GET habits list */
router.get('/habits', async(req, res) => {
  try{
    const habits = await Habit.find();
    res.json(habits);
  }catch(err){
    console.error("Error retrieving habit ->", err);
    res.status(500).json({message:'Error retrieving habits'});
  }
  
});

/* POST habit (CREATE) */
router.post('/habits', async(req, res) => {
  try{
    const {title, description} = req.body;
    const habit = new Habit({title, description});
    await habit.save();
    res.json(habit);
  }catch(err){
    console.error("Error creating habit ->", err);
    res.status(400).json({message:'Error creating habit'});
  }
  });

/* DELETE habit by id */
router.delete('/habits/:id', async(req, res) => {
  try{
    await Habit.findByIdAndDelete(req.params.id);
    res.json({message : 'Habit deleted'});
  }catch(err){
    console.error("Error deleting habit ->", err);
    res.status(204).json({message: 'Habit not found'});
  }


});


module.exports = router;
