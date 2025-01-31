const Mechanic = require('../models/mechanic.model'); // Adjust path as needed

// Add a new mechanic
const addMechanic = async (req, res) => {
    try {
        const { name, specialization, experience, description } = req.body;
        const photo = req.file ? req.file.path : null;

        if (!photo) {
            return res.status(400).json({ message: 'Photo is required' });
        }

        const newMechanic = new Mechanic({
            name,
            specialization,
            photo,
            experience,
            description
        });

        await newMechanic.save();

        res.status(201).json({ message: 'Mechanic added successfully!', mechanic: newMechanic });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all mechanics
const getMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find();
        res.status(200).json(mechanics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single mechanic by ID
const getMechanicById = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }
        res.status(200).json(mechanic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a mechanic's details
const updateMechanic = async (req, res) => {
    try {
        const { name, specialization, experience, description } = req.body;
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }

        mechanic.name = name || mechanic.name;
        mechanic.specialization = specialization || mechanic.specialization;
        mechanic.experience = experience || mechanic.experience;
        mechanic.description = description || mechanic.description;

        if (req.file) {
            const oldPhotoPath = mechanic.photo;
            if (oldPhotoPath && fs.existsSync(path.join(__dirname, '../', oldPhotoPath))) {
                fs.unlinkSync(path.join(__dirname, '../', oldPhotoPath)); // Delete old photo
            }
            mechanic.photo = req.file.path; // Update with new photo
        } else {
            mechanic.photo = mechanic.photo; // Keep existing photo if no new one is uploaded
        }

        await mechanic.save();

        res.status(200).json({ message: 'Mechanic updated successfully!', mechanic });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a mechanic
const deleteMechanic = async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params.id);
        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }

        // Use deleteOne instead of remove()
        await Mechanic.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Mechanic deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addMechanic, getMechanics, getMechanicById, updateMechanic, deleteMechanic };
