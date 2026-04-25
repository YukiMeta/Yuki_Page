#!/bin/bash

echo "=========================================="
echo "   Homebrew 安装指南"
echo "=========================================="
echo ""
echo "请按照以下步骤安装 Homebrew:"
echo ""
echo "1️⃣  打开您的终端应用 (Terminal.app)"
echo ""
echo "2️⃣  复制并粘贴以下命令,然后按回车:"
echo ""
echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
echo ""
echo "3️⃣  当提示输入密码时,输入您的 Mac 登录密码"
echo "    (注意: 输入密码时不会显示任何字符,这是正常的)"
echo ""
echo "4️⃣  等待安装完成 (可能需要几分钟)"
echo ""
echo "5️⃣  安装完成后,根据提示运行以下命令来配置环境变量:"
echo ""
echo '    echo "eval \"\$(/opt/homebrew/bin/brew shellenv)\"" >> ~/.zprofile'
echo '    eval "$(/opt/homebrew/bin/brew shellenv)"'
echo ""
echo "6️⃣  验证安装:"
echo ""
echo "    brew --version"
echo ""
echo "=========================================="
echo ""
echo "💡 提示: 如果您使用的是 Apple Silicon (M1/M2/M3) Mac,"
echo "   Homebrew 会安装到 /opt/homebrew"
echo "   如果是 Intel Mac,会安装到 /usr/local"
echo ""
echo "按回车键继续..."
read

# 自动运行安装命令
echo ""
echo "🚀 正在启动 Homebrew 安装..."
echo ""
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
