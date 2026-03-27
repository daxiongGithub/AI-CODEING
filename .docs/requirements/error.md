# 错误统计

1. className 产生了ts的报错
   1. 通过 `tsconfig.json`中引入 `nativewind-env.d.ts` 修复
   2. 添加 `declare module` 导出对象增加className属性来修复
2. npm run start 产生了报错
   1. 打开xcode、打开模拟器后再次运行
3. node_modules/expo-router/entry.js: .plugins is not a valid Plugin property
   1. 原来是少了东西，让ai检测后安装了一些包就好了
4. CommandError: Failed to build iOS project. "xcodebuild" exited with error code 70.

## 项目中的待解决错误

1. ~~分类管理有两个标题（需要杀进程，重启项目才生效）~~
2. ~~一级分类的标题左侧icon不是圆的~~
3. 长按分类，还有停用的功能，这个需要再了解了解
4. ~~新增分类时碰到的所有input无法顺畅输入文字(原来是需要模拟器键盘输入才有效)~~
5. ~~点击选择图标不需要图标的默认选中状态，需要是点击高亮就可以了~~
6.
