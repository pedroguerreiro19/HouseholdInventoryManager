const Item = require("../models/Item");
const mongoose = require("mongoose");

const createItem = async (req, res) => {
  try {
    const { name, description, groupId, forFamily } = req.body;
    const ownerId = req.user.id;

    const item = new Item({
      name,
      description,
      ownerId,
      groupId,
      forFamily,
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Error creating item" });
  }
};

const getItemsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const items = await Item.find({
      groupId: new mongoose.Types.ObjectId(groupId),
    }).populate("ownerId");
    console.log("Found items for group:", groupId, items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error finding items." });
  }
};

const getItemsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Item.find({ ownerId: userId }).populate("ownerId");
    console.log("Found items:", userId, items);
    res.json(items);
  } catch (err) {
    res.status(500).json({ err: "Error getting user items." });
  }
};

const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.itemid);
    res.json({ message: "Succesfully deleted item." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item." });
  }
};

module.exports = {
  createItem,
  getItemsByGroup,
  getItemsByUser,
  deleteItem,
};
