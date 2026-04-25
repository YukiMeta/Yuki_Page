#!/usr/bin/env python3
import subprocess
import sys

def set_default_browser_to_safari():
    """Set Safari as the default browser using SwiftDefaultApps"""
    try:
        # Check if SwiftDefaultApps is installed
        result = subprocess.run(['which', 'swda'], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ SwiftDefaultApps (swda) 未安装")
            print("📦 正在安装 SwiftDefaultApps...")
            
            # Install SwiftDefaultApps using Homebrew
            install_result = subprocess.run(
                ['brew', 'install', 'swiftdefaultappsprefpane'],
                capture_output=True,
                text=True
            )
            
            if install_result.returncode != 0:
                print("❌ 无法通过 Homebrew 安装")
                print("\n请手动设置默认浏览器:")
                print("1. 打开 '系统设置' (System Settings)")
                print("2. 点击 '桌面与程序坞' (Desktop & Dock)")
                print("3. 向下滚动到 '默认网页浏览器' (Default web browser)")
                print("4. 选择 'Safari'")
                return False
        
        # Set Safari as default
        print("🔧 正在设置 Safari 为默认浏览器...")
        set_result = subprocess.run(
            ['swda', 'setHandler', '--app', 'Safari', '--URL', 'http'],
            capture_output=True,
            text=True
        )
        
        if set_result.returncode == 0:
            print("✅ Safari 已设置为默认浏览器!")
            return True
        else:
            print(f"❌ 设置失败: {set_result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ 发生错误: {e}")
        return False

if __name__ == "__main__":
    success = set_default_browser_to_safari()
    sys.exit(0 if success else 1)
