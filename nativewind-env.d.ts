/// <reference types="nativewind/types" />

import "react-native";

import "react-native-safe-area-context";
declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ImagePropsBase {
    className?: string;
    cssInterop?: boolean;
  }
}
declare module "react-native-safe-area-context" {
  export interface NativeSafeAreaViewProps {
    className?: string;
  }
}
