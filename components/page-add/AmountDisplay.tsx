import { useRef } from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import { TEXT_SECONDARY_COLOR, TEXT_MAIN_COLOR } from "@/constants/theme";

export interface AmountDisplayProps {
  rawAmount: string;
  onChangeAmount: (v: string) => void;
  onFocusChange?: (focused: boolean) => void;
}

/**
 * AmountDisplay — 金额输入区域
 * 显示 "¥" 前缀 + 右侧 TextInput（decimal-pad 键盘）。
 * 点击任意区域均可唤起键盘。
 */
export function AmountDisplay(props: AmountDisplayProps) {
  const { rawAmount, onChangeAmount, onFocusChange } = props;
  const inputRef = useRef<TextInput>(null);

  /** 通知父级当前聚焦状态 */
  const handleFocusChange = (focused: boolean) => {
    onFocusChange?.(focused);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      className="items-center py-6 gap-2"
    >
      <Text className="text-[13px]" style={{ color: TEXT_SECONDARY_COLOR }}>
        金额
      </Text>

      <View className="flex-row items-center gap-1">
        {/* ¥ 前缀，与金额数字同尺寸 */}
        <Text
          className="text-[44px] font-bold"
          style={{ color: rawAmount ? TEXT_MAIN_COLOR : TEXT_SECONDARY_COLOR }}
        >
          ¥
        </Text>

        <TextInput
          ref={inputRef}
          value={rawAmount}
          onChangeText={onChangeAmount}
          onFocus={() => handleFocusChange(true)}
          onBlur={() => handleFocusChange(false)}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={TEXT_SECONDARY_COLOR}
          returnKeyType="done"
          selectionColor="#f97316"
          style={{
            fontSize: 44,
            fontWeight: "700",
            color: TEXT_MAIN_COLOR,
            minWidth: 80,
            // 移除 TextInput 默认内边距
            padding: 0,
            includeFontPadding: false,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
