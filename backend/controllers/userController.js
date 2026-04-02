const User = require('../models/User');
const paginate = require('../utils/paginate');
const { sendSuccess, sendError } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        const result = await paginate(User, filter, req.query);
        return sendSuccess(res, result, 'Users fetched successfully.');
    } catch (error) {
        next(error);
    }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendError(res, 'User already exists with this email.', 400);
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            isActive: true
        });

        return sendSuccess(res, { user }, 'User created successfully.', 201);
    } catch (error) {
        next(error);
    }
};


const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return sendError(res, 'User not found.', 404);
        }

        if (user.role === 'admin') {
            return sendError(res, 'Cannot delete an admin account.', 403);
        }

        await user.deleteOne();
        return sendSuccess(res, null, 'User deleted successfully.');
    } catch (error) {
        next(error);
    }
};


const getLecturers = async (req, res, next) => {
    try {
        const lecturers = await User.find({ role: 'lecturer' }).select('name email');
        return sendSuccess(res, lecturers, 'Lecturers fetched successfully.');
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return sendError(res, 'User not found.', 404);

        const { name, email, password } = req.body;

        if (name) user.name = name;
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
            if (emailExists) return sendError(res, 'Email already in use.', 400);
            user.email = email;
        }
        if (password) user.password = password;

        await user.save();

        // Return updated user (excluding password)
        const updatedUser = await User.findById(user._id).select('-password');
        return sendSuccess(res, updatedUser, 'Profile updated successfully.');
    } catch (error) {
        next(error);
    }
};


module.exports = { getAllUsers, deleteUser, createUser, getLecturers, updateProfile , loginUser  };
