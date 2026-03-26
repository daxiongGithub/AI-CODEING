import { View, TextInput, Text } from "react-native";
import { FilePenLine } from "lucide-react-native";
import { TEXT_SECONDARY_COLOR, TEXT_MAIN_COLOR } from "@/constants/theme";

export interface NoteInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
}

/**
 * NoteInput — 备注多行输入框
 * 最多 50 字，右下角显示剩余字数。
 */
export function NoteInput(props: NoteInputProps) {
  const { value, onChangeText, onFocus } = props;

  return (
    <View className="bg-white rounded-[10px] border border-zinc-200 flex-row gap-2 p-3">
      <FilePenLine
        size={18}
        color={TEXT_SECONDARY_COLOR}
        style={{ marginTop: 1 }}
      />
      <View className="flex-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder="备注（最多50字）"
          placeholderTextColor={TEXT_SECONDARY_COLOR}
          maxLength={50}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          returnKeyType="done"
          blurOnSubmit
          style={{
            fontSize: 13,
            color: TEXT_MAIN_COLOR,
            minHeight: 56,
            padding: 0,
          }}
        />
        {value.length > 0 && (
          <Text className="text-[11px] text-zinc-400 text-right mt-1">
            {value.length}/50
          </Text>
        )}
      </View>
    </View>
  );
}
