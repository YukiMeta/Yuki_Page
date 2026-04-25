#!/bin/bash
# 配置 Gemini API Key

echo "🔑 配置 Gemini API"
echo "请输入你的 Gemini API Key:"
read -s GEMINI_API_KEY
echo ""

# 使用 paste-token 命令配置
OpenClaw models auth paste-token --profile gemini --token "$GEMINI_API_KEY"

echo ""
echo "✅ Gemini API 配置完成！"
echo ""
echo "📋 查看所有配置："
OpenClaw channels list
echo ""
OpenClaw models auth
echo ""
echo "🚀 现在可以启动 OpenClaw:"
echo "   OpenClaw start"
