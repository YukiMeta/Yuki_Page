#!/bin/bash
# YouTube 视频翻译工具 - 日常使用指南

echo "📺 YouTube 视频翻译工具"
echo "========================"
echo ""
echo "💡 使用方法："
echo ""
echo "1️⃣  复制 YouTube 视频链接"
echo "   例如: https://www.youtube.com/watch?v=xxxxx"
echo ""
echo "2️⃣  运行翻译命令："
echo "   cd /Users/miaoyoyo/Metasite"
echo "   ./translate_video.sh \"视频链接\""
echo ""
echo "3️⃣  等待翻译完成（约5-15分钟，取决于视频长度）"
echo ""
echo "4️⃣  在 ./subtitles/ 目录查看生成的字幕文件："
echo "   - .en.srt (英文原文)"
echo "   - .zh.srt (中文翻译)"
echo "   - .bilingual.srt (双语字幕)"
echo ""
echo "5️⃣  使用字幕："
echo "   - 用 VLC 播放器加载字幕"
echo "   - 或直接用文本编辑器阅读"
echo ""
echo "========================"
echo ""
read -p "请输入 YouTube 视频链接（或按 Ctrl+C 退出）: " VIDEO_URL

if [ -z "$VIDEO_URL" ]; then
    echo "❌ 未输入链接，退出"
    exit 1
fi

echo ""
echo "🚀 开始翻译..."
cd /Users/miaoyoyo/Metasite
./translate_video.sh "$VIDEO_URL"
