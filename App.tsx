import React from "react";
import { NativeBaseProvider, StatusBar, extendTheme } from "native-base";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Matrix } from "./screens/Matrix";
import { NativeRouter, Route, Routes } from "react-router-native";
import Toast from "react-native-toast-message";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}
export default function App() {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        {/* TODO: status bar is white on my phone */}
        <StatusBar />
        <SafeAreaView>
          <NativeRouter>
            <Routes>
              <Route path="/" Component={Matrix} />
            </Routes>
          </NativeRouter>
        </SafeAreaView>
      </NativeBaseProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
