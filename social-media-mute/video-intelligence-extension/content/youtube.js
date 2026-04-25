// YouTube 集成 - 提取字幕和视频信息
(function () {
    'use strict';

    console.log('[Video Intelligence] YouTube script loaded');

    let analyzer = null;
    let subtitleText = '';
    let isAnalyzing = false;

    // 初始化 AI 分析器
    function initAnalyzer() {
        if (window.AIAnalyzer) {
            analyzer = new window.AIAnalyzer();
            console.log('[YouTube] AI Analyzer initialized');
        } else {
            console.error('[YouTube] AIAnalyzer not found');
        }
    }

    // 提取 YouTube 字幕
    function extractSubtitles() {
        const video = document.querySelector('video');
        if (!video) {
            console.log('[YouTube] No video element found');
            return;
        }

        // 尝试获取字幕轨道
        const textTracks = video.textTracks;
        if (!textTracks || textTracks.length === 0) {
            console.log('[YouTube] No text tracks available');
            tryExtractFromAPI();
            return;
        }

        // 监听字幕变化
        for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];

            if (track.kind === 'subtitles' || track.kind === 'captions') {
                track.mode = 'hidden'; // 启用但不显示

                track.addEventListener('cuechange', () => {
                    const cues = track.activeCues;
                    if (cues && cues.length > 0) {
                        const text = Array.from(cues).map(cue => cue.text).join(' ');
                        subtitleText += text + ' ';

                        // 每收集 500 字符触发一次分析
                        if (subtitleText.length > 500 && !isAnalyzing) {
                            analyzeContent();
                        }
                    }
                });

                console.log('[YouTube] Subtitle track attached');
                break;
            }
        }
    }

    // 从 YouTube API 提取字幕
    function tryExtractFromAPI() {
        // 获取视频 ID
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        console.log('[YouTube] Trying to fetch subtitles from API for:', videoId);

        // 尝试从页面数据中提取字幕
        const ytInitialData = window.ytInitialPlayerResponse;
        if (ytInitialData && ytInitialData.captions) {
            const captionTracks = ytInitialData.captions.playerCaptionsTracklistRenderer?.captionTracks;
            if (captionTracks && captionTracks.length > 0) {
                // 优先选择英文或中文字幕
                const track = captionTracks.find(t => t.languageCode === 'en' || t.languageCode === 'zh') || captionTracks[0];
                fetchSubtitleFromUrl(track.baseUrl);
            }
        }
    }

    // 从 URL 获取字幕
    async function fetchSubtitleFromUrl(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();

            // 解析 XML 格式的字幕
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const textElements = xmlDoc.getElementsByTagName('text');

            subtitleText = Array.from(textElements)
                .map(el => el.textContent)
                .join(' ');

            console.log('[YouTube] Subtitles fetched:', subtitleText.length, 'characters');

            if (subtitleText.length > 100) {
                analyzeContent();
            }
        } catch (error) {
            console.error('[YouTube] Failed to fetch subtitles:', error);
        }
    }

    // 分析内容
    async function analyzeContent() {
        if (isAnalyzing || !analyzer) return;

        isAnalyzing = true;
        console.log('[YouTube] Starting AI analysis...');

        try {
            const result = await analyzer.analyzeContent(subtitleText);

            // 发送结果到侧边栏
            window.postMessage({
                type: 'VIDEO_INTELLIGENCE_UPDATE',
                data: result
            }, '*');

            console.log('[YouTube] Analysis complete:', result);
        } catch (error) {
            console.error('[YouTube] Analysis failed:', error);
        } finally {
            isAnalyzing = false;
        }
    }

    // 获取视频信息
    function getVideoInfo() {
        const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
        const title = titleElement ? titleElement.textContent.trim() : 'Unknown';

        return {
            title,
            url: window.location.href,
            platform: 'youtube'
        };
    }

    // 初始化
    function init() {
        console.log('[YouTube] Initializing...');

        // 等待 AIAnalyzer 加载
        setTimeout(() => {
            initAnalyzer();
            extractSubtitles();

            // 发送视频信息
            window.postMessage({
                type: 'VIDEO_INTELLIGENCE_INIT',
                data: getVideoInfo()
            }, '*');
        }, 1000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听 URL 变化（YouTube 是单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            subtitleText = '';
            init();
        }
    }).observe(document, { subtree: true, childList: true });

})();
