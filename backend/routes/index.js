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
    res.status(200).json(habits);
  }catch(err){
    console.error("Error retrieving habit ->", err);
    res.status(500).json({ message: 'Error retrieving habits' });
  }
});

/* POST habit (CREATE) */
router.post('/habits', async(req, res) => {
  try{
    const {title, description} = req.body;
    const habit = new Habit({title, description});
    await habit.save();
    res.status(201).json(habit);
  }catch(err){
    console.error("Error creating habit ->", err);
    res.status(400).json({ error: 'Error creating habit' });
  }
  });

/* DELETE habit by id */
router.delete('/habits/:id', async(req, res) => {
  try{
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message : 'Habit deleted' });
  }catch(err){
    console.error("Error deleting habit ->", err);
    res.status(204).json({ message: 'Habit not found'} );
  }
});

/* UPDATE habit by id (SET DONE) */
router.patch('/habits/done/:id', async(req, res) => {
  try{
    const habit = await Habit.findById(req.params.id);
    habit.lastDone = new Date();
    if(timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24){
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.lastUpdate = new Date();
      await habit.save();
      res.status(200).json({message: 'Habit marked as done'});
    }else{
      habit.days = 1;
      habit.lastUpdate = new Date();
      habit.startedAt = new Date();
      await habit.save();
      res.status(200).json({ message: 'Habit restarted' })
    }  
  }catch(err){
    console.error("Error setting habit to done ->", err);
    res.status(500).json({ error: 'Error setting habit to done' })
  }
})

const timeDifferenceInHours = (date1, date2) => {
  const differenceMS = Math.abs(date1 - date2);
  return differenceMS / (1000 * 3600);
}

const timeDifferenceInDays = (date1, date2) => {
  const differenceMS = Math.abs(date1 - date2);
  return Math.floor(differenceMS / (1000 * 3600 * 24));
}

module.exports = router;
