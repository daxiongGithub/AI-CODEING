import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* 月度概览卡片 */}
      <View className="mx-4 mt-4 p-5 bg-orange-500 rounded-2xl">
        <Text className="text-white text-sm opacity-80">本月结余</Text>
        <Text className="text-white text-4xl font-bold mt-1">¥0.00</Text>
        <View className="flex-row mt-4 gap-8">
          <View>
            <Text className="text-white text-xs opacity-80">收入</Text>
            <Text className="text-white text-base font-semibold">¥0.00</Text>
          </View>
          <View>
            <Text className="text-white text-xs opacity-80">支出</Text>
            <Text className="text-white text-base font-semibold">¥0.00</Text>
          </View>
        </View>
      </View>

      {/* 账目列表占位 */}
      <ScrollView className="flex-1 mt-4 px-4">
        <Text className="text-gray-400 text-sm text-center py-16">
          还没有账目，点击右下角 + 开始记账
        </Text>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center"
        onPress={() => router.push('/add')}
        activeOpacity={0.85}
      >
        <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
