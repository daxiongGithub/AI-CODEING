import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import { TEXT_MAIN_COLOR } from "@/constants/theme";

interface NavbarProps {
  title: string;
  showBorder?: boolean;
}

export function Navbar({ title, showBorder = false }: NavbarProps) {
  return (
    <View className="bg-white">
      <SafeAreaView edges={["top"]} />
      <View
        className={clsx(
          "h-11 items-center justify-center bg-white",
          showBorder && "border-b border-zinc-200",
        )}
      >
        <Text
          style={{ fontSize: 17, fontWeight: "600", color: TEXT_MAIN_COLOR }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
