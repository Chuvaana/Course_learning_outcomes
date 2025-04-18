const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200', // Allow your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CLO application.' });
});

require('./app/routes/config.routes')(app);

// require("./app/routes/teacher.routes")(app);
require('./app/routes/branch.routes')(app);
require('./app/routes/teacher.routes')(app);
require('./app/routes/student.routes')(app);
require('./app/routes/lesson.routes')(app);
require('./app/routes/clo.routes')(app);
require('./app/routes/cloPlan.routes')(app);
require('./app/routes/pointPlan.routes')(app);
require('./app/routes/material.routes')(app);
require('./app/routes/schedule.routes')(app);
require('./app/routes/scheduleSem.routes')(app);
require('./app/routes/scheduleLab.routes')(app);
require('./app/routes/scheduleBd.routes')(app);
require('./app/routes/definition.routes')(app);
require('./app/routes/methodology.routes')(app);
require('./app/routes/assessment.routes')(app);
require('./app/routes/additional.routes')(app);
require('./app/routes/lesStudent.routes')(app);
require('./app/routes/attendance.routes')(app);
require('./app/routes/assessFooter.routes')(app);
require('./app/routes/lessonAssessments.routes')(app);
require('./app/routes/labGrade.routes')(app);
require('./app/routes/lessonCurriculums.routes')(app);
require('./app/routes/plan.routes')(app);
require('./app/routes/cloPointPlan.routes')(app);
require('./app/routes/pollQuestions.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
