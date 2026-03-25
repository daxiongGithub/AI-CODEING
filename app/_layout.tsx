import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { initDatabase } from "@/db/client";
import { seedPresetCategories } from "@/db/seed";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await seedPresetCategories();
      } catch (error) {
        console.error("[DB] Init error:", error);
      } finally {
        setDbReady(true);
        await SplashScreen.hideAsync();
      }
    }
    void prepare();
  }, []);

  if (!dbReady) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{
            presentation: "modal",
            title: "记一笔",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="scan" options={{ title: "截图记账" }} />
        <Stack.Screen
          name="categories"
          options={{ title: "分类管理", headerShown: false }}
        />
      </Stack>
    </>
  );
}
