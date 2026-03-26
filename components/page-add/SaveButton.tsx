import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { Check } from "lucide-react-native";
import clsx from "clsx";
import { ON_PRIMARY_COLOR } from "@/constants/theme";

export interface SaveButtonProps {
  /** 是否满足保存条件（金额 > 0 且已选分类） */
  canSave: boolean;
  isLoading: boolean;
  onSave: () => void;
}

/**
 * SaveButton — 保存按钮 + 提示文案
 * 未满足条件时按钮置灰且不可点击。
 */
export function SaveButton(props: SaveButtonProps) {
  const { canSave, isLoading, onSave } = props;

  return (
    <View className="gap-2">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSave}
        disabled={!canSave || isLoading}
        className={clsx(
          "h-11 rounded-xl flex-row items-center justify-center gap-2",
          canSave ? "bg-brand" : "bg-border",
        )}
      >
        {isLoading ? (
          <ActivityIndicator color={ON_PRIMARY_COLOR} size="small" />
        ) : (
          <>
            <Check size={18} color={ON_PRIMARY_COLOR} strokeWidth={2.5} />
            <Text className="text-[15px] font-semibold text-on-brand">
              保存
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text className="text-[11px] text-zinc-400 text-center">
        金额 &gt; 0 且已选分类后可提交
      </Text>
    </View>
  );
}
