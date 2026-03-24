import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">记账页（M2 实现）</Text>
      </View>
    </SafeAreaView>
  );
}
