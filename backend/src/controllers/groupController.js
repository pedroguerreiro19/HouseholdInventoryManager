const Group = require("../models/Group");
const User = require("../models/User");

function generateJoinCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  const length = 6;

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const createGroup = async (req, res) => {
  const { name, creatorId } = req.body;
  try {
    let joinCode;
    let existing;

    do {
      joinCode = generateJoinCode();
      existing = await Group.findOne({ joinCode });
    } while (existing);

    if (!name || !creatorId) {
      return res.status(400).json({ error: "Missing name or creatorId" });
    }

    const group = new Group({
      name,
      creator: creatorId,
      joinCode,
      members: [creatorId],
    });
    await group.save();

    await User.findByIdAndUpdate(creatorId, { familyGroup: group._id });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

const joinGroup = async (req, res) => {
  const { groupCode, userId } = req.body;
  try {
    const group = await Group.findOne({ joinCode: groupCode });

    if (!group) {
      return res.status(404).json({ error: "Invalid join code" });
    }

    await User.findByIdAndUpdate(userId, { familyGroup: group._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to join group" });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const members = await User.find({ familyGroup: groupId }).select(
      "name _id email"
    );

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: "Error fetching group members" });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).select("name joinCode _id");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: "Error fetching group" });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  getGroupMembers,
  getGroupById,
};
