#!/bin/bash
# OpenClaw 多 Bot 配置脚本（修复版）
# 先添加所有 Bot，然后配置模型

set -e

echo "🦞 OpenClaw 多 Bot 配置向导"
echo "================================"
echo ""

# MoriMoney 已经添加，跳过
echo "✅ MoriMoney 已配置"
echo ""

# 配置 MoriStudio
echo "📱 配置 MoriStudio Bot"
echo "请输入 MoriStudio Bot Token:"
read -s MORISTUDIO_TOKEN
echo ""

# 配置 MoriMedia
echo "📱 配置 MoriMedia Bot"
echo "请输入 MoriMedia Bot Token:"
read -s MORIMEDIA_TOKEN
echo ""

# 获取 Gemini API Key
echo "🔑 配置 Gemini API Key"
echo "请输入 Gemini API Key:"
read -s GEMINI_API_KEY
echo ""

echo ""
echo "⚙️  开始配置..."
echo ""

# 添加 MoriStudio
echo "2️⃣  添加 MoriStudio..."
OpenClaw channels add --channel telegram --account MoriStudio --token "$MORISTUDIO_TOKEN"

# 添加 MoriMedia
echo "3️⃣  添加 MoriMedia..."
OpenClaw channels add --channel telegram --account MoriMedia --token "$MORIMEDIA_TOKEN"

echo ""
echo "🔧 配置 Gemini API..."
echo ""

# 配置 Gemini 认证
OpenClaw models auth add --provider gemini --api-key "$GEMINI_API_KEY"

echo ""
echo "✅ 配置完成！"
echo ""
echo "📋 已配置的账号："
OpenClaw channels list

echo ""
echo "💡 提示："
echo "   - MoriMoney: 使用默认 AI 模型"
echo "   - MoriStudio: 可以使用 Gemini 模型"
echo "   - MoriMedia: 可以使用 Gemini 模型"
echo ""
echo "🚀 启动 OpenClaw:"
echo "   OpenClaw start"
echo ""
