const Definition = require('../models/definition.model');

// POST: Create or update a definition
exports.createDefinition = async (req, res) => {
  try {
    const { lessonId, description, goal } = req.body;

    // Create a new definition
    const definition = new Definition({
      lessonId,
      description,
      goal
    });

    const savedDefinition = await definition.save();
    res.status(201).json(savedDefinition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving definition' });
  }
};

// GET: Get all definitions
exports.getAllDefinitions = async (req, res) => {
  try {
    const definitions = await Definition.find();
    res.status(200).json(definitions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving definitions' });
  }
};

// GET: Get a definition by ID
exports.getDefinitionById = async (req, res) => {
  try {
    const definition = await Definition.find({lessonId: req.params.id});
    if (!definition) {
      return res.status(404).json({ message: 'Definition not found' });
    }
    res.status(200).json(definition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving definition' });
  }
};

exports.updateDefinition = async (req, res) => {
    try {
      const { lessonId, description, goal } = req.body;
  
      // Check if the definition exists
      const existingDefinition = await Definition.findOne({ lessonId });
  
      if (!existingDefinition) {
        return res.status(404).json({ message: 'Definition not found' });
      }
  
      // Update the existing definition
      existingDefinition.description = description || existingDefinition.description;
      existingDefinition.goal = goal || existingDefinition.goal;
  
      // Save the updated definition
      const updatedDefinition = await existingDefinition.save();
  
      res.status(200).json(updatedDefinition);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating definition' });
    }
  };