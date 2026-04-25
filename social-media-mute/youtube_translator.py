#!/usr/bin/env python3
"""
YouTube 视频翻译工具
下载 YouTube 视频字幕并翻译成中文
"""

import os
import sys
import subprocess
import json
import srt
import requests
from datetime import timedelta
from pathlib import Path


class YouTubeTranslator:
    def __init__(self, ollama_url="http://localhost:11434", model="qwen2.5-coder:7b"):
        self.ollama_url = ollama_url
        self.model = model
        self.output_dir = Path("./subtitles")
        self.output_dir.mkdir(exist_ok=True)

    def download_subtitles(self, video_url):
        """下载 YouTube 视频的英文字幕"""
        print(f"📥 正在下载字幕...")
        
        # 获取视频信息
        info_cmd = [
            "yt-dlp",
            "--skip-download",
            "--write-auto-sub",
            "--sub-lang", "en",
            "--sub-format", "srt",
            "--output", str(self.output_dir / "%(title)s.%(ext)s"),
            video_url
        ]
        
        try:
            result = subprocess.run(info_cmd, capture_output=True, text=True, check=True)
            
            # 查找下载的字幕文件
            srt_files = list(self.output_dir.glob("*.en.srt"))
            if not srt_files:
                print("❌ 未找到英文字幕，尝试下载手动字幕...")
                # 尝试下载手动字幕
                manual_cmd = [
                    "yt-dlp",
                    "--skip-download",
                    "--write-sub",
                    "--sub-lang", "en",
                    "--sub-format", "srt",
                    "--output", str(self.output_dir / "%(title)s.%(ext)s"),
                    video_url
                ]
                subprocess.run(manual_cmd, check=True)
                srt_files = list(self.output_dir.glob("*.en.srt"))
            
            if srt_files:
                subtitle_file = srt_files[0]
                print(f"✅ 字幕下载成功: {subtitle_file.name}")
                return subtitle_file
            else:
                raise FileNotFoundError("无法下载字幕文件")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ 下载失败: {e}")
            return None

    def translate_text(self, text, batch_mode=False):
        """使用 Ollama 翻译文本"""
        prompt = f"""请将以下英文翻译成简体中文，只返回翻译结果，不要添加任何解释：

{text}"""
        
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=60
            )
            response.raise_for_status()
            result = response.json()
            translation = result.get("response", "").strip()
            return translation
        except Exception as e:
            print(f"⚠️  翻译失败: {e}")
            return text  # 返回原文

    def translate_subtitle_file(self, srt_file):
        """翻译整个字幕文件（批量处理）"""
        print(f"🔄 正在翻译字幕...")
        
        # 读取 SRT 文件
        with open(srt_file, 'r', encoding='utf-8') as f:
            subtitle_content = f.read()
        
        # 解析 SRT
        subtitles = list(srt.parse(subtitle_content))
        total = len(subtitles)
        
        # 批量翻译（每次处理 10 条）
        batch_size = 10
        translated_subtitles = []
        
        for i in range(0, total, batch_size):
            batch = subtitles[i:i+batch_size]
            batch_texts = [sub.content for sub in batch]
            
            # 合并文本进行批量翻译
            combined_text = "\n---\n".join(batch_texts)
            prompt = f"""请将以下英文字幕翻译成简体中文。每条字幕用"---"分隔，翻译时保持相同的分隔符，只返回翻译结果：

{combined_text}"""
            
            try:
                response = requests.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False
                    },
                    timeout=120
                )
                response.raise_for_status()
                result = response.json()
                translation = result.get("response", "").strip()
                
                # 分割翻译结果
                translated_batch = translation.split("---")
                
                # 确保翻译结果数量匹配
                if len(translated_batch) != len(batch):
                    # 如果批量翻译失败，回退到逐条翻译
                    translated_batch = [self.translate_text(text) for text in batch_texts]
                
            except Exception as e:
                print(f"\n⚠️  批量翻译失败，使用逐条翻译: {e}")
                translated_batch = [self.translate_text(text) for text in batch_texts]
            
            # 创建翻译后的字幕条目
            for sub, trans_text in zip(batch, translated_batch):
                translated_sub = srt.Subtitle(
                    index=sub.index,
                    start=sub.start,
                    end=sub.end,
                    content=trans_text.strip()
                )
                translated_subtitles.append(translated_sub)
            
            # 显示进度
            progress = min(i + batch_size, total)
            print(f"  翻译进度: {progress}/{total} ({progress*100//total}%)", end='\r')
        
        print(f"\n✅ 翻译完成!")
        
        # 生成中文字幕文件
        zh_file = srt_file.parent / srt_file.name.replace('.en.srt', '.zh.srt')
        with open(zh_file, 'w', encoding='utf-8') as f:
            f.write(srt.compose(translated_subtitles))
        
        print(f"💾 中文字幕已保存: {zh_file.name}")
        
        # 生成双语字幕
        bilingual_file = self.create_bilingual_subtitle(subtitles, translated_subtitles, srt_file)
        
        return zh_file, bilingual_file

    def create_bilingual_subtitle(self, en_subs, zh_subs, original_file):
        """创建双语字幕文件"""
        print(f"🔀 正在生成双语字幕...")
        
        bilingual_subs = []
        for en, zh in zip(en_subs, zh_subs):
            # 合并英文和中文
            bilingual_content = f"{en.content}\n{zh.content}"
            bilingual_sub = srt.Subtitle(
                index=en.index,
                start=en.start,
                end=en.end,
                content=bilingual_content
            )
            bilingual_subs.append(bilingual_sub)
        
        # 保存双语字幕
        bilingual_file = original_file.parent / original_file.name.replace('.en.srt', '.bilingual.srt')
        with open(bilingual_file, 'w', encoding='utf-8') as f:
            f.write(srt.compose(bilingual_subs))
        
        print(f"💾 双语字幕已保存: {bilingual_file.name}")
        return bilingual_file

    def process_video(self, video_url):
        """处理整个视频翻译流程"""
        print(f"\n🎬 开始处理视频: {video_url}\n")
        
        # 1. 下载字幕
        en_subtitle = self.download_subtitles(video_url)
        if not en_subtitle:
            return None
        
        # 2. 翻译字幕
        zh_subtitle, bilingual_subtitle = self.translate_subtitle_file(en_subtitle)
        
        print(f"\n🎉 完成! 生成了以下文件:")
        print(f"  📄 英文字幕: {en_subtitle.name}")
        print(f"  📄 中文字幕: {zh_subtitle.name}")
        print(f"  📄 双语字幕: {bilingual_subtitle.name}")
        
        return {
            "en": en_subtitle,
            "zh": zh_subtitle,
            "bilingual": bilingual_subtitle
        }


def main():
    if len(sys.argv) < 2:
        print("用法: python3 youtube_translator.py <YouTube视频链接>")
        print("示例: python3 youtube_translator.py https://www.youtube.com/watch?v=T9aRN5JkmL8")
        sys.exit(1)
    
    video_url = sys.argv[1]
    
    # 创建翻译器实例
    translator = YouTubeTranslator()
    
    # 处理视频
    result = translator.process_video(video_url)
    
    if result:
        print(f"\n✨ 字幕文件保存在: {translator.output_dir.absolute()}")
    else:
        print("\n❌ 处理失败")
        sys.exit(1)


if __name__ == "__main__":
    main()
