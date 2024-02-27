const ejs = require('ejs');
const User  = require('../models/User');

const renderAdminPage = async (req, res) => {
  try {
    const items = await User.find(); 

    ejs.renderFile('./views/user/admin.ejs', { items: items }, (err, html) => {
        if (err) {
            console.error(err);
            return res.send('Error loading the admin page');
        }
        res.render('layout/main', { body: html });
    });
} catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
};

const addUser = async (req, res) => {
    try {
      const { itemName, itemEmail, password, name } = req.body;
  
      const newUser = new User({
        name: name,
        username: itemName,
        email: itemEmail,
        password: password, 
      });
  
      await newUser.save();

      res.redirect('/admin');
    } catch (error) {
      console.error('Error adding new user:', error);
      if (error.code === 11000) {
        return res.status(400).send('Error: Duplicate email or username');
      }
      res.status(500).send('Error adding new user');
    }
};


const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Error fetching user');
    }
  };


  const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.redirect('/admin');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Error deleting user');
    }
  };

  const updateUser = async (req, res) => {
    try {

      const { name, username, email, password } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      if (name) user.name = name;
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) {
        // Ensure password is hashed when updated
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
      res.redirect('/admin');
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Error updating user');
    }
  };
  
  
module.exports = {
    renderAdminPage, 
    addUser,
    getUserById,
    deleteUser,
    updateUser,
  };