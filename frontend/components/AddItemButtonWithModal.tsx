import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { createItem } from "../utils/api";

export default function AddItemButtonWithModal({
  onItemAdded,
}: {
  onItemAdded?: () => void;
}) {
  const { user, userToken } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [forFamily, setForFamily] = useState(false);

  const handleAddItem = async () => {
    if (!itemName || !user || !userToken) return;

    const newItem = {
      name: itemName,
      description: itemDesc,
      ownerId: user._id,
      groupId: user.familyGroup || null,
      forFamily,
    };

    await createItem(newItem, userToken);
    onItemAdded?.();
    setModalVisible(false);
    setItemName("");
    setItemDesc("");
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-24 right-6 bg-primary rounded-full p-4 shadow-lg active:opacity-80"
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-bold mb-4 text-center text-primary">
              Add new item
            </Text>
            <TextInput
              placeholder="Item name"
              value={itemName}
              onChangeText={setItemName}
              className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
            />
            <TextInput
              placeholder="Item description (optional)"
              value={itemDesc}
              onChangeText={setItemDesc}
              className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
            />
            {user?.familyGroup && (
              <View className="mb-4 gap-2">
                <TouchableOpacity
                  className="flex-row items-center gap-2"
                  onPress={() => setForFamily(false)}
                >
                  <View
                    className={`w-5 h-5 border rounded ${
                      !forFamily ? "bg-primary" : "bg-white"
                    }`}
                  />
                  <Text className="text-gray-800">The item it's for me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center gap-2"
                  onPress={() => setForFamily(true)}
                >
                  <View
                    className={`w-5 h-5 border rounded ${
                      forFamily ? "bg-primary" : "bg-white"
                    }`}
                  />
                  <Text className="text-gray-800">
                    The item it's for the family
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={handleAddItem}
              className="bg-primary p-3 rounded-2xl mb-2"
            >
              <Text className="text-center text-white font-bold">Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-100 p-3 rounded-xl"
            >
              <Text className="text-center text-red-600 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
