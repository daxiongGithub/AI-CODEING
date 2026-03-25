import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">统计图表（M3 实现）</Text>
      </View>
    </SafeAreaView>
  );
}
