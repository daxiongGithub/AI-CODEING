import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
import dayjs from "dayjs";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  TEXT_SECONDARY_COLOR,
  TEXT_MAIN_COLOR,
  BRAND_COLOR,
  BG_OVERLAY_COLOR,
} from "@/constants/theme";

export interface DatePickerButtonProps {
  /** YYYY-MM-DD */
  date: string;
  onDateChange: (date: string) => void;
}

/** 日期显示标签：今天 / 昨天 / 具体格式 */
function getDateLabel(dateStr: string): string {
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  if (dateStr === today) return `今天，${dayjs(dateStr).format("M月D日")}`;
  if (dateStr === yesterday) return `昨天，${dayjs(dateStr).format("M月D日")}`;
  return dayjs(dateStr).format("YYYY年M月D日");
}

const WEEK_LABELS = ["日", "一", "二", "三", "四", "五", "六"] as const;

/**
 * DatePickerButton — 日期选择按钮 + 日历弹窗
 * 不依赖 @react-native-community/datetimepicker，使用月历网格实现。
 */
export function DatePickerButton(props: DatePickerButtonProps) {
  const { date, onDateChange } = props;
  const [visible, setVisible] = useState(false);
  // 日历当前展示的月份（月初）
  const [viewMonth, setViewMonth] = useState(() =>
    dayjs(date).startOf("month"),
  );

  const daysInMonth = viewMonth.daysInMonth();
  const firstDayOfWeek = viewMonth.startOf("month").day(); // 0=日

  const handleSelect = (day: number) => {
    onDateChange(viewMonth.date(day).format("YYYY-MM-DD"));
    setVisible(false);
  };

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <>
      {/* 触发按钮 */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
        className="flex-row items-center gap-2 h-11 bg-white rounded-[10px] border border-zinc-200 px-3"
      >
        <CalendarDays size={18} color={TEXT_SECONDARY_COLOR} />
        <Text
          className="flex-1 text-[13px] font-medium"
          style={{ color: TEXT_MAIN_COLOR }}
        >
          {getDateLabel(date)}
        </Text>
      </TouchableOpacity>

      {/* 日历弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: BG_OVERLAY_COLOR }}
          onPress={() => setVisible(false)}
        >
          {/* 阻止内部点击冒泡到遮罩 */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <SafeAreaView className="bg-white rounded-t-2xl">
              <View className="px-4 pt-4 pb-6">
                {/* 月份导航 */}
                <View className="flex-row items-center justify-between mb-4">
                  <TouchableOpacity
                    onPress={() => setViewMonth((m) => m.subtract(1, "month"))}
                    className="p-2"
                  >
                    <ChevronLeft size={20} color={TEXT_SECONDARY_COLOR} />
                  </TouchableOpacity>
                  <Text className="text-[15px] font-semibold text-zinc-900">
                    {viewMonth.format("YYYY年M月")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setViewMonth((m) => m.add(1, "month"))}
                    className="p-2"
                  >
                    <ChevronRight size={20} color={TEXT_SECONDARY_COLOR} />
                  </TouchableOpacity>
                </View>

                {/* 星期标题 */}
                <View className="flex-row mb-2">
                  {WEEK_LABELS.map((d) => (
                    <Text
                      key={d}
                      className="flex-1 text-center text-[12px] text-zinc-400"
                    >
                      {d}
                    </Text>
                  ))}
                </View>

                {/* 日期格子 */}
                <View className="flex-row flex-wrap">
                  {/* 月首偏移空格 */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <View key={`pad-${i}`} style={{ width: `${100 / 7}%` }} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (day) => {
                      const dayStr = viewMonth.date(day).format("YYYY-MM-DD");
                      const isSelected = dayStr === date;
                      const isToday = dayStr === today;
                      return (
                        <TouchableOpacity
                          key={day}
                          onPress={() => handleSelect(day)}
                          style={{ width: `${100 / 7}%` }}
                          className="items-center py-1"
                        >
                          <View
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: isSelected ? BRAND_COLOR : "transparent",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: isSelected || isToday ? "600" : "400",
                                color: isSelected
                                  ? "#ffffff"
                                  : isToday
                                    ? BRAND_COLOR
                                    : TEXT_MAIN_COLOR,
                              }}
                            >
                              {day}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
