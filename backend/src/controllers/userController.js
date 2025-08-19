const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "This e-mail already belongs to an account." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal error." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate({path: "familyGroup", model: "Group"});
    if (!user) {
      return res
        .status(400)
        .json({ message: "The e-mail isn't associated to an account." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login done successfully.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        familyGroup: user.familyGroup,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error while doing the login." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user." });
  }
};

const editUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "User not found."});

    res.json({ message: "User updated successfuly.", user});
  } catch (err) {
    console.error ("Error updating user:", err);
    res.status(500).json({ message: "Internal error."});
  }
};

const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found."});

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect"});

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message:"Password changed successfuly"});
  } catch (err) {
    console.error("Error changing password");
    res.status(500).json({ message:" Internal error."});
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message:"User not found."});

    res.json({ message: "User deleted successfuly." });
  } catch (err) {
    console.error("Error deleting user:", err)
    res.status(500).json({message: "Internal error."})
  }
}

module.exports = {
  createUser,
  loginUser,
  getUser,
  editUser,
  changeUserPassword,
  deleteUser,
};
