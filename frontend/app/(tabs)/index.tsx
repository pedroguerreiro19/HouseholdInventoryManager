import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CheckCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  BounceInDown,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useAuth } from "../../contexts/AuthContext";
import { getItemsByGroup, getItemsByUser, deleteItem } from "../../utils/api";
import { Item } from "../../types/models";
import AddItemButtonWithModal from "../../components/AddItemButtonWithModal";
import { getGroupById } from "../../utils/api";

export default function Index() {
  const { user, userToken, login } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [showMissing, setShowMissing] = useState(false);
  const router = useRouter();

useEffect(() => {
  const loadAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (typeof parsedUser.familyGroup === "string") {
          try {
            const groupData = await getGroupById(parsedUser.familyGroup, token);
            parsedUser.familyGroup = groupData;
          } catch (err) {
            console.error("Erro ao restaurar dados do grupo:", err);
          }
        }

        await login(token, parsedUser);
        console.log("Stored user:", parsedUser);
      }
    } catch (err) {
      console.error("Error loading auth data", err);
    }
  };

  loadAuth();
}, []);

  const fetchItems = async () => {
    if (!user || !userToken) return;

    try {
      const fetchedItems = user.familyGroup
        ? await getItemsByGroup(user.familyGroup._id, userToken)
        : await getItemsByUser(user._id, userToken);

      setItems(fetchedItems);
    } catch (err) {
      console.error("Error fetching items: ", err);
    }
  };

  useEffect(() => {
    if (user && userToken) {
      fetchItems();
    }
  }, [user, userToken]);

  const missingItems = Array.isArray(items)
    ? items.filter((item) => {
        if (!user) return false;
        const ownerId =
          typeof item.ownerId === "string" ? item.ownerId : item.ownerId._id;
        return item.forFamily || ownerId === user._id;
      })
    : [];

  return (
    <LinearGradient
      colors={["#0288d1", "#b2ebf2"]}
      className="flex-1"
    >
      <View className="flex-1 px-6 pt-20 items-center">
        <Animated.Text
          entering={BounceInDown.duration(1000)}
          className="text-4xl font-bold text-white mb-4"
        >
          🏠 CasaCheia
        </Animated.Text>

        <Animated.Text
          entering={BounceInDown.duration(1400)}
          className="text-xl font-semibold text-white mb-8 text-center"
        >
          Welcome back, {user?.name || "User"} 👋 !
        </Animated.Text>
<ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          className="w-full max-w-sm self-center"
        >
          <View className="bg-white rounded-2xl mb-4 shadow-lg">
            <TouchableOpacity
              onPress={() => setShowMissing((prev) => !prev)}
              className="flex-row justify-between items-center p-4"
            >
              <Text className="text-lg font-semibold text-blue-900">
                🛒 Missing items at home
              </Text>
              {missingItems.length > 0 && (
                <View className="bg-red-500 rounded-full px-2 py-1">
                  <Text className="text-white text-xs font-bold">
                    {missingItems.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {showMissing && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(150)}
                className="px-6 pb-4"
              >
                {missingItems.length === 0 ? (
                  <Text className="text-gray-500 text-sm italic">
                    No item missing
                  </Text>
                ) : (
                  missingItems.map((item: Item) => (
                    <View
                      key={item._id}
                      className="bg-white p-4 mb-3 flex-row rounded-2xl items-center justify-between shadow"
                    >
                      <View className="flex-1 pr-2">
                        <Text className="font-bold text-gray-800 text-base">
                          {item.name}
                        </Text>
                        {item.description && (
                          <Text className="text-gray-600">{item.description}</Text>
                        )}
                        <Text className="text-gray-500">
                          {item.forFamily ? "For the family" : "Personal"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={async () => {
                          try {
                            if (!userToken) return;
                            await deleteItem(item._id, userToken);
                            setItems((prev) =>
                              prev.filter((i) => i._id !== item._id)
                            );
                          } catch (err) {
                            console.error("Error deleting item: ", err);
                          }
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
        </ScrollView>
      </View>

      <AddItemButtonWithModal onItemAdded={fetchItems} />
    </LinearGradient>
  );
}