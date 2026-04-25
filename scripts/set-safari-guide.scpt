#!/usr/bin/osascript

tell application "System Settings"
    activate
    delay 1
end tell

display dialog "请按照以下步骤设置 Safari 为默认浏览器:

1. 在左侧菜单中点击 '桌面与程序坞' (Desktop & Dock)
2. 向下滚动到底部
3. 找到 '默认网页浏览器' (Default web browser)
4. 点击下拉菜单,选择 'Safari'

完成后点击 OK。" buttons {"OK"} default button "OK" with icon note
