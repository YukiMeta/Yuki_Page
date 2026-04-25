#!/bin/bash

echo "🔧 重新加载 shell 配置..."
source ~/.zshrc

echo "✅ 验证 npm 配置..."
npm config get prefix

echo ""
echo "📦 安装 OpenAI Codex..."
npm install -g @openai/codex

echo ""
echo "🎉 完成! 现在您可以使用 'codex' 命令了"
