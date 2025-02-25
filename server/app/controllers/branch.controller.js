const db = require("../models");
const Branch = db.branches;

// Create and Save a new Branch
exports.create = (req, res) => {
  if (!req.body.name || !req.body.departments) {
    res.status(400).send({ message: "Branch name and departments are required!" });
    return;
  }

  const branch = new Branch({
    name: req.body.name,
    departments: req.body.departments
  });

  branch
    .save(branch)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error occurred while creating the branch." }));
};

// Retrieve all Branches
exports.findAll = (req, res) => {
  Branch.find({}, { name: 1, _id: 1 }) // Only return branch names
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error retrieving branches." }));
};

// Retrieve a single Branch by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Branch.findById(id)
    .then(data => {
      if (!data) res.status(404).send({ message: `No branch found with id ${id}` });
      else res.send(data);
    })
    .catch(err => res.status(500).send({ message: "Error retrieving branch with id=" + id }));
};

// Update a Branch by ID
exports.update = (req, res) => {
  if (!req.body) return res.status(400).send({ message: "Data to update cannot be empty!" });

  const id = req.params.id;

  Branch.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) res.status(404).send({ message: `Cannot update branch with id=${id}. Maybe not found!` });
      else res.send({ message: "Branch was updated successfully." });
    })
    .catch(err => res.status(500).send({ message: "Error updating branch with id=" + id }));
};

// Delete a Branch by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Branch.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) res.status(404).send({ message: `Cannot delete branch with id=${id}. Maybe not found!` });
      else res.send({ message: "Branch was deleted successfully!" });
    })
    .catch(err => res.status(500).send({ message: "Could not delete branch with id=" + id }));
};

// Delete all Branches
exports.deleteAll = (req, res) => {
  Branch.deleteMany({})
    .then(data => res.send({ message: `${data.deletedCount} branches were deleted successfully!` }))
    .catch(err => res.status(500).send({ message: err.message || "Error occurred while removing all branches." }));
};

exports.branchNames = async (req, res) => {
  try {
    const branches = await Branch.find({}, { name: 1, _id: 0 }); // Await the database query
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branches', error: error.message });
  }
};

exports.findDepartments = async (req, res) => {
  try {
    const branchId = req.params.id; // Get branch ID from URL

    // Find the branch by ID and retrieve only the 'departments' field
    const branch = await Branch.findById(branchId).select("departments");

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json(branch.departments); // Return only the departments array
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};
