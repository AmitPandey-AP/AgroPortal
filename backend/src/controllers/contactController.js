const Contact = require('../models/Contact');

// @desc    Submit a contact query
// @route   POST /api/contact
// @access  Public
const submitQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message are required' });

    const query = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Query submitted successfully', query });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitQuery };
