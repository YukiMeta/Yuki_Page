// Background Service Worker
console.log('[Video Intelligence] Background script loaded');

// 监听扩展安装
chrome.runtime.onInstalled.addListener(() => {
    console.log('[Video Intelligence] Extension installed');
});

// 监听来自 content scripts 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Background] Message received:', request);

    if (request.type === 'ANALYZE_CONTENT') {
        // 可以在这里处理一些后台任务
        sendResponse({ success: true });
    }

    return true;
});
