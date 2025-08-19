import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckCircle } from "lucide-react-native";
import { getGroupById } from "../../utils/api";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Item, User } from "../../types/models";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AddItemButtonWithModal from "../../components/AddItemButtonWithModal";
import {
  getItemsByUser,
  createGroup,
  joinGroup,
  getGroupMembers,
  deleteItem,
} from "../../utils/api";

export default function FamilyGroupScreen() {
  const { user, userToken, login } = useAuth();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [group, setGroup] = useState<any>(null);

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedMyItems, setExpandedMyItems] = useState(false);

  const [members, setMembers] = useState<User[]>([]);
  const [memberItems, setMemberItems] = useState<Record<string, Item[]>>({});
  const [myItems, setMyItems] = useState<Item[]>([]);

  useEffect(() => {
    const ensureUserLoaded = async () => {
      if (!user && !userToken) return;
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (token && storedUser) {
        await login(token, JSON.parse(storedUser));
        console.log("Forced login in FamilyGroup", JSON.parse(storedUser));
      }
    };
    ensureUserLoaded();
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!user?.familyGroup || !userToken) return;

      try {
        const groupData = await getGroupById(user.familyGroup._id, userToken);
        setGroup(groupData);
      } catch (err) {
        console.error("Error fetching group data", err);
      }
    };

    fetchGroup();
  }, [user, userToken]);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!user?.familyGroup || !userToken) return;

      try {
        const fetchedMembers: User[] = await getGroupMembers(
          user.familyGroup._id,
          userToken
        );
        setMembers(fetchedMembers);
      } catch (err) {
        console.error("Error fetching group members", err);
      }
    };

    fetchGroupData();
  }, [user, userToken]);

  const toggleMyItems = async () => {
    if (expandedMyItems) {
      setExpandedMyItems(false);
      return;
    }

    if (!user || !userToken) return;

    try {
      const items = await getItemsByUser(user._id, userToken);
      setMyItems(items);
      setExpandedMyItems(true);
    } catch (err) {
      console.error("Error fetching my items", err);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !userToken || !user) return;
    try {
      console.log("Creating group with:", groupName, user?._id);
      const createdGroup = await createGroup(
        { name: groupName, creatorId: user._id },
        userToken
      );
      const updatedUser = { ...user, familyGroup: createdGroup._id };
      await login(userToken, updatedUser);
      setCreateModalVisible(false);
      Alert.alert("Success!", "You just created your family group!");
    } catch (err) {
      Alert.alert("Error", "Failed to create group. Please try again.");
      console.error("Error creating group", err);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim() || !userToken || !user) return;
    if (!/^[A-Z0-9]{6}$/.test(joinCode)) {
      Alert.alert("Invalid Code", "Please enter a valid 6-character code");
      return;
    }

    try {
      const newGroup = await joinGroup(
        { groupCode: joinCode, userId: user._id },
        userToken
      );
      const updatedUser = { ...user, familyGroup: newGroup._id };
      await login(userToken, updatedUser);
      Alert.alert("Success!", "You have joined the family group!");
      setJoinModalVisible(false);
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to join group. Please check the code and try again."
      );
      console.error("Error joining group", err);
    }
  };

  const toggleExpand = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    if (!userToken) return;

    try {
      const items = await getItemsByUser(userId, userToken);
      setMemberItems((prev) => ({ ...prev, [userId]: items }));
    } catch (err) {
      console.error("Error fetching member items", err);
    }
  };

  return (
    <>
      {!user?.familyGroup ? (
        <>
          <LinearGradient colors={["#0288d1", "#b2ebf2"]} className="flex-1 px-6 pt-20">
            <Text className="text-2xl font-extrabold text-center text-primary mb-6">
              👨‍👩‍👧‍👦 Family Group
            </Text>
            <TouchableOpacity
              className="bg-primary p-4 rounded-xl w-full mb-4"
              onPress={() => setCreateModalVisible(true)}
            >
              <Text className="text-white font-bold text-center">
                Create a family group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-primary p-4 rounded-xl w-full"
              onPress={() => setJoinModalVisible(true)}
            >
              <Text className="text-center text-primary font-bold">
                Join a family group with a code
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <Modal visible={createModalVisible} transparent animationType="fade">
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
              <View className="bg-white w-full p-6 rounded-2xl">
                <Text className="text-xl font-bold mb-4 text-center text-primary">
                  Create a family group
                </Text>
                <TextInput
                  placeholder="Group name"
                  value={groupName}
                  onChangeText={setGroupName}
                  className="border border-gray-300 rounded-xl px-4 py-4 mb-4"
                />
                <TouchableOpacity
                  onPress={handleCreateGroup}
                  className="bg-primary p-3 rounded-xl mb-2"
                >
                  <Text className="text-center text-white font-bold">
                    Create
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCreateModalVisible(false)}
                  className="p-2"
                >
                  <Text className="text-center text-red-500">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={joinModalVisible} transparent animationType="fade">
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
              <View className="bg-white w-full p-6 rounded-2xl">
                <Text className="text-xl font-bold mb-4 text-center text-primary">
                  Join Group
                </Text>
                <TextInput
                  placeholder="Enter group code"
                  value={joinCode}
                  onChangeText={setJoinCode}
                  className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
                />
                <TouchableOpacity
                  onPress={handleJoinGroup}
                  className="bg-primary p-3 rounded-xl mb-2"
                >
                  <Text className="text-center text-white font-bold">Join</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setJoinModalVisible(false)}
                  className="p-2"
                >
                  <Text className="text-center text-red-500">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
       <LinearGradient
          colors={["#0288d1", "#b2ebf2"]}
          className="flex-1 px-4 pt-16"
        >
          <Text className="text-3xl font-bold text-white text-center mb-6">
            👨‍👩‍👧‍👦 {group?.name || "Family"} Family Group
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
          >
            <View className="bg-white rounded-2xl mb-4 shadow-lg">
              <TouchableOpacity
                onPress={toggleMyItems}
                className="flex-row justify-between items-center p-4"
              >
                <Text className="text-lg font-semibold text-blue-900">
                  📦 My items
                </Text>
                {myItems.length > 0 && (
                  <View className="bg-red-500 rounded-full px-2 py-1">
                    <Text className="text-white text-xs font-bold">
                      {myItems.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {expandedMyItems && (
                <Animated.View
                  entering={FadeIn.duration(150)}
                  exiting={FadeOut.duration(150)}
                  className="px-6 pb-4"
                >
                  {myItems.length === 0 ? (
                    <Text className="text-gray-500 text-sm italic">
                      You haven't added any items.
                    </Text>
                  ) : (
                    myItems.map((item) => (
                      <View
                        key={item._id}
                        className="bg-white p-4 mb-3 flex-row rounded-2xl items-center justify-between shadow"
                      >
                        <View className="flex-1 pr-2">
                          <Text className="font-bold text-gray-800 text-base">
                            {item.name}
                          </Text>
                          <Text className="text-gray-600">
                            {item.description}
                          </Text>
                          <Text className="text-gray-500">
                            {item.forFamily ? "For the family" : "Personal"}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            if (!userToken) return;
                            await deleteItem(item._id, userToken);
                            setMyItems((prev) =>
                              prev.filter((i) => i._id !== item._id)
                            );
                          }}
                          className="ml-2"
                        >
                          <CheckCircle size={24} color="#22c55e" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </Animated.View>
              )}
            </View>

            {Array.isArray(members) &&
              members
                .filter((member) => member._id !== user._id)
                .map((member) => (
                  <View
                    key={member._id}
                    className="bg-white rounded-2xl mb-4 shadow"
                  >
                    <TouchableOpacity
                      onPress={() => toggleExpand(member._id)}
                      className="flex-row justify-between items-center p-4"
                    >
                      <View className="flex-row items-center space-x-2">
                        <Text className="text-2xl">👤</Text>
                        <Text className="font-semibold text-lg text-gray-800">
                          {member.name}
                        </Text>
                      </View>
                      {memberItems[member._id]?.length > 0 && (
                        <View className="bg-red-500 rounded-full px-2 py-1">
                          <Text className="text-white text-xs font-bold">
                            {memberItems[member._id].length}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {expandedUserId === member._id && (
                      <Animated.View
                        entering={FadeIn.duration(50)}
                        exiting={FadeOut.duration(50)}
                        className="px-6 pb-4"
                      >
                        {memberItems[member._id]?.length === 0 ? (
                          <Text className="text-gray-500 text-sm italic">
                            No items added by {member.name}
                          </Text>
                        ) : (
                          memberItems[member._id].map((item: Item) => (
                            <View
                              key={item._id}
                              className="bg-gray-100 rounded-xl p-3 mb-2 shadow-sm"
                            >
                              <Text className="font-bold text-gray-800">
                                {item.name}
                              </Text>
                              <Text className="text-gray-600">
                                {item.description}
                              </Text>
                            </View>
                          ))
                        )}
                      </Animated.View>
                    )}
                  </View>
                ))}
          </ScrollView>

          <View className="absolute bottom-24 left-6 right-6">
            <TouchableOpacity
              onPress={() => setShowInviteModal(true)}
              className="bg-white px-8 py-3 rounded-full shadow-md active:opacity-80"
              style={{ alignSelf: "flex-start" }}
            >
              <Text className="text-center text-primary font-bold">
                Invite users
              </Text>
            </TouchableOpacity>
          </View>

          <Modal visible={showInviteModal} transparent animationType="fade">
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
              <View className="bg-white w-full p-6 rounded-2xl items-center">
                <Text className="text-xl font-bold mb-4 text-center text-primary">
                  📩 Invite to Group
                </Text>
                {group?.joinCode ? (
                  <>
                    <Text className="text-gray-600 mb-2">
                      Share this code with family members:
                    </Text>
                    <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl mb-4">
                      <Text className="text-lg font-mono">
                        {group.joinCode}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigator.clipboard.writeText(group.joinCode);
                          Alert.alert(
                            "Copied!",
                            "The join code has been copied to your clipboard."
                          );
                        }}
                        className="ml-4"
                      >
                        <Text className="text-blue-500 font-bold">Copy</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <Text className="text-red-500">Join code not found</Text>
                )}

                <TouchableOpacity
                  onPress={() => setShowInviteModal(false)}
                  className="mt-2"
                >
                  <Text className="text-red-500 font-bold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <AddItemButtonWithModal />
        </LinearGradient>
      )}
    </>
  );
}