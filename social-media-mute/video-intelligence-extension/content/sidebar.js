// 侧边栏 - 显示 AI 分析结果
(function () {
    'use strict';

    console.log('[Video Intelligence] Sidebar script loaded');

    let videoInfo = null;
    let analysisData = null;

    // 创建侧边栏 HTML
    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'vi-sidebar';
        sidebar.innerHTML = `
      <div class="vi-header">
        <h3>📝 视频智能笔记</h3>
        <button id="vi-toggle" title="收起/展开">−</button>
      </div>
      
      <div class="vi-content">
        <div class="vi-section">
          <h4>📊 核心摘要</h4>
          <div id="vi-summary" class="vi-summary">
            正在分析视频内容...
          </div>
        </div>

        <div class="vi-section">
          <h4>💎 金句集锦</h4>
          <div id="vi-quotes" class="vi-quotes">
            等待提取金句...
          </div>
        </div>

        <div class="vi-actions">
          <button id="vi-export" class="vi-btn">📋 导出笔记</button>
          <button id="vi-copy" class="vi-btn">📄 复制全部</button>
        </div>
      </div>
    `;

        document.body.appendChild(sidebar);
        attachEventListeners();
    }

    // 绑定事件监听器
    function attachEventListeners() {
        // 切换显示/隐藏
        const toggleBtn = document.getElementById('vi-toggle');
        const content = document.querySelector('.vi-content');

        toggleBtn.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '−' : '+';
        });

        // 导出笔记
        document.getElementById('vi-export').addEventListener('click', exportNotes);

        // 复制全部
        document.getElementById('vi-copy').addEventListener('click', copyAll);
    }

    // 更新摘要
    function updateSummary(summary) {
        const summaryEl = document.getElementById('vi-summary');
        if (summaryEl) {
            summaryEl.innerHTML = summary.replace(/\n/g, '<br>');
        }
    }

    // 更新金句
    function updateQuotes(quotes) {
        const quotesEl = document.getElementById('vi-quotes');
        if (quotesEl && quotes.length > 0) {
            quotesEl.innerHTML = quotes
                .map(quote => `<div class="vi-quote">💡 ${quote}</div>`)
                .join('');
        }
    }

    // 导出笔记
    function exportNotes() {
        if (!videoInfo || !analysisData) {
            alert('暂无笔记可导出');
            return;
        }

        const markdown = generateMarkdown();
        downloadFile(markdown, `${videoInfo.title || 'video'}-notes.md`, 'text/markdown');
    }

    // 生成 Markdown
    function generateMarkdown() {
        let md = `# ${videoInfo.title}\n\n`;
        md += `**来源**: ${videoInfo.platform === 'youtube' ? 'YouTube' : 'B站'}\n`;
        md += `**链接**: ${videoInfo.url}\n`;
        md += `**时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;
        md += `---\n\n`;

        md += `## 📊 核心摘要\n\n`;
        md += `${analysisData.summary}\n\n`;

        md += `## 💎 金句集锦\n\n`;
        analysisData.quotes.forEach(quote => {
            md += `- ${quote}\n`;
        });

        md += `\n---\n\n`;
        md += `*由 Video Intelligence 自动生成*\n`;

        return md;
    }

    // 下载文件
    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 复制全部
    function copyAll() {
        if (!videoInfo || !analysisData) {
            alert('暂无内容可复制');
            return;
        }

        const markdown = generateMarkdown();
        navigator.clipboard.writeText(markdown).then(() => {
            alert('✅ 已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('❌ 复制失败');
        });
    }

    // 监听来自内容脚本的消息
    window.addEventListener('message', (event) => {
        if (event.source !== window) return;

        const { type, data } = event.data;

        if (type === 'VIDEO_INTELLIGENCE_INIT') {
            videoInfo = data;
            console.log('[Sidebar] Video info received:', videoInfo);
        }

        if (type === 'VIDEO_INTELLIGENCE_UPDATE') {
            analysisData = data;
            console.log('[Sidebar] Analysis data received:', analysisData);

            updateSummary(data.summary);
            updateQuotes(data.quotes);
        }
    });

    // 初始化侧边栏
    function init() {
        // 检查是否已存在侧边栏
        if (document.getElementById('vi-sidebar')) {
            console.log('[Sidebar] Already exists');
            return;
        }

        createSidebar();
        console.log('[Sidebar] Created successfully');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
