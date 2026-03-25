import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";

/** 面板标题栏，含新增按钮；disabled 时按钮置灰不可点 */
interface CategoryPanelHeaderProps {
  title: string;
  onAdd: () => void;
  disabled?: boolean;
}

export function CategoryPanelHeader(props: CategoryPanelHeaderProps) {
  const { title, onAdd, disabled = false } = props;
  return (
    <View className="h-[40px] flex-row items-center justify-between border-b border-border px-3">
      <Text className="text-[12px] font-semibold text-text-secondary">{title}</Text>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.7}
        onPress={disabled ? undefined : onAdd}
        className={clsx(
          "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center",
          disabled ? "border-zinc-300" : "border-brand",
        )}
      >
        <Text
          className={clsx(
            "text-[13px] font-semibold leading-none",
            disabled ? "text-zinc-300" : "text-brand",
          )}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
