import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react-native";
import { TEXT_MAIN_COLOR } from "@/constants/theme";
import { useRouter } from "expo-router";

interface NavbarProps {
  title: string;
  showBorder?: boolean;
  /** 显示返回箭头，点击回调 */
  hasBack?: boolean;
  onBack?: () => void;
  /** 右侧插槽，传入任意组件 */
  right?: ReactNode;
}

export function Navbar(props: NavbarProps) {
  const { title, showBorder = false, hasBack, onBack, right } = props;
  const router = useRouter();
  const hasActions = hasBack !== undefined || right !== undefined;

  return (
    <View className="bg-white">
      <SafeAreaView edges={["top"]} />
      <View
        className={clsx("bg-white h-11 flex-row items-center pr-4", {
          "justify-center pr-0": !hasActions,
          "border-b border-zinc-200": showBorder,
        })}
      >
        {hasBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack || router.back}
            className="h-8 w-8 items-center justify-center"
          >
            <ChevronLeft size={20} color={TEXT_MAIN_COLOR} />
          </TouchableOpacity>
        )}
        <Text className="text-[17px] font-semibold text-text-main">{title}</Text>
        {right && <View className="ml-auto">{right}</View>}
      </View>
    </View>
  );
}
