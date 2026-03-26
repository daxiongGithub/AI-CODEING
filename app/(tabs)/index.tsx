import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowDown, ArrowUp, Folder, Plus } from "lucide-react-native";
import dayjs from "dayjs";

import { useTransactionStore } from "@/store/transactionStore";
import { formatAmount, formatCurrency } from "@/utils/formatCurrency";
import { getDateLabel, getMonthRange } from "@/utils/dateUtils";
import { BG_TOKEN_MAP, DANGER_COLOR, SUCCESS_COLOR, TEXT_TOKEN_MAP } from "@/constants/theme";
import { ICON_MAP } from "@/constants/icons";
import type { TransactionWithCategory } from "@/types";

// ─── 类型 ────────────────────────────────────────────────

type DayGroup = {
  date: string;
  dailyIncome: number;
  dailyExpense: number;
  items: TransactionWithCategory[];
};

// ─── 工具函数 ─────────────────────────────────────────────

function groupByDate(txns: TransactionWithCategory[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const tx of txns) {
    let group = map.get(tx.date);
    if (!group) {
      group = { date: tx.date, dailyIncome: 0, dailyExpense: 0, items: [] };
      map.set(tx.date, group);
    }
    group.items.push(tx);
    if (tx.type === "income") group.dailyIncome += tx.amount;
    else group.dailyExpense += tx.amount;
  }
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
}

// ─── 子组件 ───────────────────────────────────────────────

function TransactionItem({ tx }: { tx: TransactionWithCategory }) {
  const IconComponent = ICON_MAP[tx.categoryIcon] ?? Folder;
  const bgColor = BG_TOKEN_MAP[tx.categoryColorBg] ?? "#f3f4f6";
  const iconColor = TEXT_TOKEN_MAP[tx.categoryColorText] ?? "#6b7280";
  const title = tx.note ?? tx.subCategoryName ?? tx.categoryName;
  const subtitle = title !== tx.categoryName ? tx.categoryName : undefined;
  const amountColor = tx.type === "income" ? SUCCESS_COLOR : DANGER_COLOR;
  const amountSign = tx.type === "income" ? "+" : "-";

  return (
    <View
      className="flex-row items-center rounded-xl bg-white px-3 h-16"
      style={{
        gap: 12,
        borderWidth: 1,
        borderColor: "#e4e4e7",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <IconComponent size={20} color={iconColor} />
      </View>
      <View className="flex-1" style={{ gap: 3 }}>
        <Text className="text-zinc-900 text-[15px] font-medium" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-zinc-500 text-xs" numberOfLines={1}>
          {subtitle ?? tx.categoryName}
        </Text>
      </View>
      <Text className="text-base font-semibold" style={{ color: amountColor }}>
        {amountSign}
        {formatCurrency(tx.amount)}
      </Text>
    </View>
  );
}

function DayGroupSection({ group }: { group: DayGroup }) {
  const label = getDateLabel(group.date);
  const dateStr = dayjs(group.date).format("M月D日");
  const displayLabel = label === "今天" || label === "昨天" ? `${label}, ${dateStr}` : label;
  const parts: string[] = [];
  if (group.dailyExpense > 0) parts.push(`支: ${formatAmount(group.dailyExpense)}`);
  if (group.dailyIncome > 0) parts.push(`收: ${formatAmount(group.dailyIncome)}`);

  return (
    <View style={{ gap: 12 }}>
      <View className="flex-row items-center justify-between pb-2">
        <Text className="text-zinc-900 text-sm font-semibold">{displayLabel}</Text>
        <Text className="text-zinc-500 text-xs">{parts.join("  ")}</Text>
      </View>
      {group.items.map((tx) => (
        <TransactionItem key={tx.id} tx={tx} />
      ))}
    </View>
  );
}

// ─── 页面 ─────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { monthlySummary, recentTransactions, loadMonthlySummary, loadRecentTransactions } =
    useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  const now = dayjs();
  const year = now.year();
  const month = now.month() + 1;

  const loadData = useCallback(async () => {
    const { start, end } = getMonthRange(year, month);
    await Promise.all([loadMonthlySummary(year, month), loadRecentTransactions(start, end)]);
  }, [year, month, loadMonthlySummary, loadRecentTransactions]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const groups = useMemo(() => groupByDate(recentTransactions), [recentTransactions]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 月度概览卡片 */}
        <View
          className="rounded-[20px] bg-orange-500 pt-5 px-5 pb-4"
          style={{
            gap: 12,
            shadowColor: "#F97316",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Text className="text-white/60 text-xs">本月结余</Text>
          <Text className="text-white text-[34px] font-bold leading-tight">
            {formatCurrency(monthlySummary.balance)}
          </Text>
          <View className="flex-row" style={{ gap: 10 }}>
            {/* 收入 */}
            <View
              className="flex-1 rounded-[10px] pt-[10px] pb-[10px] px-3"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", gap: 6 }}
            >
              <View className="flex-row items-center" style={{ gap: 5 }}>
                <View
                  className="w-[18px] h-[18px] rounded items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <ArrowUp size={11} color="#ffffff" />
                </View>
                <Text className="text-white/70 text-[11px] font-medium">收入</Text>
              </View>
              <Text className="text-white font-bold text-[17px]">
                {formatCurrency(monthlySummary.totalIncome)}
              </Text>
            </View>
            {/* 支出 */}
            <View
              className="flex-1 rounded-[10px] pt-[10px] pb-[10px] px-3"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", gap: 6 }}
            >
              <View className="flex-row items-center" style={{ gap: 5 }}>
                <View
                  className="w-[18px] h-[18px] rounded items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <ArrowDown size={11} color="#ffffff" />
                </View>
                <Text className="text-white/70 text-[11px] font-medium">支出</Text>
              </View>
              <Text className="text-white font-bold text-[17px]">
                {formatCurrency(monthlySummary.totalExpense)}
              </Text>
            </View>
          </View>
        </View>

        {/* 账目列表 */}
        <View style={{ marginTop: 24 }}>
          {groups.length === 0 ? (
            <Text className="text-zinc-400 text-sm text-center py-16">
              还没有账目，点击右下角 + 开始记账
            </Text>
          ) : (
            <View style={{ gap: 24 }}>
              {groups.map((group) => (
                <DayGroupSection key={group.date} group={group} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center"
        style={{
          shadowColor: "#F97316",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={() => router.push("/add")}
        activeOpacity={0.85}
      >
        <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
