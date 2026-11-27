import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is not defined in production!');
    }
    return 'zenkai_secure_jwt_secret_token_key_992178';
  }
  return secret;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d',
  });
};

// @desc Register new user
// @route POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // All public registrations are securely assigned the standard 'user' role
    const role = 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Check your email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current authenticated user
// @route GET /api/v1/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist', 'title poster releaseYear ratingSummary slug')
      .populate('favourites', 'title poster releaseYear ratingSummary slug')
      .populate('watched', 'title poster releaseYear ratingSummary slug');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT /api/v1/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};
