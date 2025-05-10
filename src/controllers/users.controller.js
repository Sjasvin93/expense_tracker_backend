const { sendApiResponse } = require("../config/api_response");
const User = require("../models/users.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create a new user
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, profileImageUrl } = req.body;

        // Check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendApiResponse(res, 'Email already exists', 400, false);
        }

        const newUser = new User({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        await newUser.save();
        sendApiResponse(res, 'User created successfully');
    } catch (error) {
        console.error(error);
        sendApiResponse(res, 'Error creating user', 500, false);
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return sendApiResponse(res, 'Invalid email or password', 400, false);
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendApiResponse(res, 'Invalid email or password', 400, false);
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id }, // payload
            process.env.JWT_SECRET, // secret key (you should define this in your .env file)
            { expiresIn: '7d' } // token expiry
        );

        // Return user details + token
        sendApiResponse(res, 'Login successful', {
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                token,
            }
        });

    } catch (error) {
        console.error(error);
        sendApiResponse(res, { error });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID
        const user = await User.findById(id).select('-password'); // Exclude password from response

        if (!user) {
            return sendApiResponse(res, 'User not found', 400, false);
        }

        sendApiResponse(res, 'User fetched successfully', { data: user });

    } catch (error) {
        console.error(error);
        sendApiResponse(res, { error });
    }
};

exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return sendApiResponse(res, 'No file uploaded', 400, false);
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        sendApiResponse(res, 'Image uploaded successfully', { data: imageUrl });
    } catch (error) {
        console.error(error);
        sendApiResponse(res, { error });
    }
};



