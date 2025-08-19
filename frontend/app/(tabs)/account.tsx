import { useState } from "react"; 
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { changeUserPassword, deleteUser, editUser } from "../../utils/api";

export default function AccountScreen() {
  const { user, userToken, login, logout } = useAuth();
  const router = useRouter();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    logout();
    router.replace("/login"); 
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (!user || !user._id || !userToken ) return;
              await deleteUser(user._id, userToken);
              Alert.alert("Account deleted", "Your account has been deleted.");
              handleLogout();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete account");
            }
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!user || !user._id || !userToken) return;
    try {
      const updatedUser = await editUser(user._id, { name, email }, userToken);
      await login(userToken, updatedUser);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfuly.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () =>{
    if (!user || !user._id || !userToken) return;
    try {
      const changePassword = await changeUserPassword(user._id, oldPassword, newPassword, userToken);
      setPasswordModalVisible(false);
      Alert.alert("Success", "Password updated");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to change password");
    }
  };

  return (
    <LinearGradient
      colors={["#0288d1", "#b2ebf2"]}
      className="flex-1 px-4 pt-16"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-extrabold text-white text-center mb-6">
          👤 My Account
        </Text>

        <View className="bg-white rounded-2xl p-6 shadow-md mb-4">
          <Text className="text-lg font-semibold mb-1 text-gray-800">Name</Text>
          <Text className="text-gray-600 mb-3">{user?.name}</Text>

          <Text className="text-lg font-semibold mb-1 text-gray-800">Email</Text>
          <Text className="text-gray-600">{user?.email}</Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Account Settings</Text>

          <TouchableOpacity
            className="bg-blue-100 py-3 px-4 rounded-xl mb-3 active:opacity-80"
            onPress={() => setEditModalVisible(true)}
          >
            <Text className="text-center text-blue-800 font-semibold">
              ✏️ Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-100 py-3 px-4 rounded-xl mb-3 active:opacity-80"
            onPress={() => setPasswordModalVisible(true)}
          >
            <Text className="text-center text-blue-800 font-semibold">
              🔑 Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-100 py-3 px-4 rounded-xl mb-3 active:opacity-80"
            onPress={handleDeleteAccount}
          >
            <Text className="text-center text-red-600 font-semibold">
              🗑️ Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 py-3 px-4 rounded-xl active:opacity-80"
            onPress={handleLogout}
          >
            <Text className="text-center text-gray-700 font-semibold">
              🚪 Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={editModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-2xl">
            <Text className="text-xl font-bold mb-4 text-center text-primary">Edit profile</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />
            <TextInput
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              keyboardType="email-address"
            />
            <TouchableOpacity className="bg-primary p-3 rounded-xl mb-2" onPress={handleSaveProfile}>
              <Text className="text-white text-center font-bold">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2" onPress={() => setEditModalVisible(false)}>
              <Text className="text-center text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={passwordModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-2xl">
            <Text className="text-xl font bold mb-4 text-center text-primary">Change password</Text>
            <TextInput
              placeholder="Old password"
              value={oldPassword}
              secureTextEntry
              onChangeText={setOldPassword}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />
            <TextInput
              placeholder="New password"
              value={newPassword}
              secureTextEntry
              onChangeText={setNewPassword}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />
            <TextInput
              placeholder="Confirm new password"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
              className="border bordey-gray-300 rounded-xl px-4 py-3 mb-4"
            />
            <TouchableOpacity className="bg-primary p-3 rounded-xl mb-2" onPress={async () => {
              if (newPassword !== confirmPassword) {
                Alert.alert("Error", "New password do not match.");
                return;
              }
              await handleChangePassword();
            }}>
              <Text className="text-white text-center font-bold">Change password</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2" onPress={() => setPasswordModalVisible(false)}>
              <Text className="text-center text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}