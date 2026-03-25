import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";

interface SegmentedControlProps {
  /** 选项文字列表，通常两项 */
  options: string[];
  /** 当前激活的索引 */
  selectedIndex: number;
  /** 切换回调 */
  onChange: (index: number) => void;
  /** 容器宽度，默认 220 */
  width?: number;
}

/**
 * SegmentedControl — 展示组件
 * iOS 风格分段选择器，设计稿规格：高度 34，padding 3，激活项白色阴影。
 */
export function SegmentedControl(props: SegmentedControlProps) {
  const { options, selectedIndex, onChange, width = 220 } = props;
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  };
  return (
    <View className="h-9 flex-row rounded-[10px] bg-gray-50 p-[3px]" style={{ width }}>
      {options.map((label, index) => {
        const isActive = index === selectedIndex;
        return (
          <TouchableOpacity
            key={label}
            activeOpacity={0.8}
            onPress={() => onChange(index)}
            className={clsx("flex-1 items-center justify-center rounded-lg", {
              "bg-white": isActive,
            })}
            style={isActive ? shadowStyle : undefined}
          >
            <Text
              className={clsx(
                "text-[13px]",
                isActive ? " text-orange-500" : " text-zinc-500",
              )}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
