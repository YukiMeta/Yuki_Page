#!/bin/bash
# YouTube 视频翻译工具 - 快捷脚本

# 激活虚拟环境并运行翻译脚本
cd "$(dirname "$0")"
source .venv/bin/activate
python3 youtube_translator.py "$@"
