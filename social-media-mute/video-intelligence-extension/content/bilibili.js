// Bilibili 集成 - 提取字幕和视频信息
(function () {
    'use strict';

    console.log('[Video Intelligence] Bilibili script loaded');

    let analyzer = null;
    let subtitleText = '';
    let isAnalyzing = false;

    // 初始化 AI 分析器
    function initAnalyzer() {
        if (window.AIAnalyzer) {
            analyzer = new window.AIAnalyzer();
            console.log('[Bilibili] AI Analyzer initialized');
        } else {
            console.error('[Bilibili] AIAnalyzer not found');
        }
    }

    // 从 Bilibili API 获取字幕
    async function fetchBilibiliSubtitles() {
        try {
            // 从页面获取视频信息
            const bvid = window.location.pathname.match(/\/video\/(BV\w+)/)?.[1];
            if (!bvid) {
                console.log('[Bilibili] No BV ID found');
                return;
            }

            // 获取 cid
            const videoData = window.__INITIAL_STATE__?.videoData;
            if (!videoData) {
                console.log('[Bilibili] No video data found');
                return;
            }

            const cid = videoData.cid || videoData.pages?.[0]?.cid;
            if (!cid) {
                console.log('[Bilibili] No CID found');
                return;
            }

            console.log('[Bilibili] Fetching subtitles for:', bvid, cid);

            // 调用 Bilibili API 获取字幕
            const response = await fetch(`https://api.bilibili.com/x/player/v2?bvid=${bvid}&cid=${cid}`);
            const data = await response.json();

            if (data.code !== 0) {
                console.error('[Bilibili] API error:', data.message);
                return;
            }

            const subtitles = data.data?.subtitle?.subtitles;
            if (!subtitles || subtitles.length === 0) {
                console.log('[Bilibili] No subtitles available');
                return;
            }

            // 获取第一个字幕轨道
            const subtitleUrl = subtitles[0].subtitle_url;
            if (!subtitleUrl) return;

            // 下载字幕内容
            const subtitleResponse = await fetch(subtitleUrl.startsWith('//') ? 'https:' + subtitleUrl : subtitleUrl);
            const subtitleData = await subtitleResponse.json();

            // 提取字幕文本
            subtitleText = subtitleData.body
                .map(item => item.content)
                .join(' ');

            console.log('[Bilibili] Subtitles fetched:', subtitleText.length, 'characters');

            if (subtitleText.length > 100) {
                analyzeContent();
            }
        } catch (error) {
            console.error('[Bilibili] Failed to fetch subtitles:', error);
        }
    }

    // 分析内容
    async function analyzeContent() {
        if (isAnalyzing || !analyzer) return;

        isAnalyzing = true;
        console.log('[Bilibili] Starting AI analysis...');

        try {
            const result = await analyzer.analyzeContent(subtitleText);

            // 发送结果到侧边栏
            window.postMessage({
                type: 'VIDEO_INTELLIGENCE_UPDATE',
                data: result
            }, '*');

            console.log('[Bilibili] Analysis complete:', result);
        } catch (error) {
            console.error('[Bilibili] Analysis failed:', error);
        } finally {
            isAnalyzing = false;
        }
    }

    // 获取视频信息
    function getVideoInfo() {
        const videoData = window.__INITIAL_STATE__?.videoData;
        const title = videoData?.title || document.querySelector('h1.video-title')?.textContent?.trim() || 'Unknown';

        return {
            title,
            url: window.location.href,
            platform: 'bilibili'
        };
    }

    // 初始化
    function init() {
        console.log('[Bilibili] Initializing...');

        // 等待页面数据加载
        setTimeout(() => {
            initAnalyzer();
            fetchBilibiliSubtitles();

            // 发送视频信息
            window.postMessage({
                type: 'VIDEO_INTELLIGENCE_INIT',
                data: getVideoInfo()
            }, '*');
        }, 2000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听 URL 变化
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
