const User = require('../MODELS/userSchema');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const RefreshToken=require('../MODELS/refreshToken')

//REGISTER 
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ username })) {
      return res.json({ message: "Username already registered!", status: false });
    }

    if (await User.findOne({ email })) {
      return res.json({ message: "Email already registered!", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const userData = user.toObject();
    delete userData.password;

    return res.json({ message: "User registered successfully!", status: true, user: userData });
  } catch (err) {
    next(err);
  }
};

// LOGIN 
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Username and password are required!", 
        status: false 
      });
    }

    const existingUser = await User.findOne({ username });
    
    if (!existingUser) {
      return res.status(401).json({ 
        message: "Invalid credentials!", 
        status: false 
      });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: "Invalid credentials!", 
        status: false 
      });
    }

    // Create access token
    const accessToken = jwt.sign(
      { id: existingUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: existingUser._id }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: '7d' }
    );

    // Save refresh token in DB
    await RefreshToken.create({ 
      userId: existingUser._id, 
      token: refreshToken, 
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });

   
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,           // true in production, false in dev
      sameSite: isProduction ? 'None' : 'Lax',  // 'None' only in production
    };

    // Set cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password from response
    const userData = existingUser.toObject();
    delete userData.password;

    return res.status(200).json({ 
      status: true, 
      user: userData,
      message: "Login successful!"
    });
    
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ 
      message: "Internal server error", 
      status: false 
    });
  }
};

// SET AVATAR 
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id; // use JWT user ID
    const avatarImage = req.body.AvatarImage;

    const userData = await User.findByIdAndUpdate(
      userId,
      { isAvatarSet: true, AvatarImage: avatarImage },
      { new: true }
    );

    return res.json({ isSet: userData.isAvatarSet, image: userData.AvatarImage });
  } catch (err) {
    next(err);
  }
};

// ALL USERS 
module.exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select([
      "email",
      "username",
      "AvatarImage",
      "_id"
    ]);
    return res.json({ users });
  } catch (err) {
    next(err);
  }
};

//REFRESH TOKEN

module.exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const dbToken = await RefreshToken.findOne({ userId: decoded.id, token });
    if (!dbToken) return res.status(401).json({ message: "Invalid refresh token" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Only generate new ACCESS token
    const accessToken = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Update last used timestamp (optional)
    dbToken.lastUsed = new Date();
    await dbToken.save();

    res.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      sameSite: 'lax', 
      maxAge: 15*60*1000 
    });

    return res.json({ status: true });
  } catch (err) {
    return res.status(401).json({ 
      status: false, 
      message: "Invalid or expired refresh token" 
    });
  }
};
//LOGOUT 
module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await RefreshToken.findOneAndDelete({ token });
    }

    // Clear cookies consistently
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({ status: true });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ status: false, message: 'Logout failed' });
  }
};



 module.exports.verify= async (req, res) => {
  console.log('VERIFY CONTROLLER CALLED'); // Add this
     console.log('req.user:', req.user);
     
  try {
    // Fetch full user data from database
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        status: false, 
        authenticated: false 
      });
    }
    res.json({
      status: true,
      authenticated: true,
      user: user // Now contains isAvatarSet, avatar, etc.
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ 
      status: false, 
      authenticated: false 
    });
  }
}