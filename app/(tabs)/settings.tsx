import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">设置页（M5 实现）</Text>
      </View>
    </SafeAreaView>
  );
}
