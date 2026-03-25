import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">截图记账（M4 实现）</Text>
      </View>
    </SafeAreaView>
  );
}
