const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

 const setAuthCookies = (res, tokens) => {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000,  // 15 minutes
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
  });
};

 const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });
  return { accessToken, refreshToken };
};

 exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });

    res.status(201).json({ user: newUser, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

 exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const tokens = generateTokens(foundUser);
    setAuthCookies(res, tokens);

    res.status(200).json({ user: foundUser, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error });
  }
};

 
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const foundUser = await User.findById(decoded.id);
    if (!foundUser) return res.status(401).json({ message: 'Invalid refresh token' });

    const tokens = generateTokens(foundUser);
    setAuthCookies(res, tokens);

    res.status(200).json({ user: foundUser, tokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Token refresh failed', error });
  }
};

 exports.getUserProfile = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id).select('-password');
    if (!foundUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(foundUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

 exports.logout = (req, res) => {
  try {
    res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Logout failed', error });
  }
};
