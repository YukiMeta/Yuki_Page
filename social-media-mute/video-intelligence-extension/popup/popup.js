// Popup 脚本
document.addEventListener('DOMContentLoaded', async () => {
    // 检测 Ollama 状态
    checkOllamaStatus();

    // 帮助链接
    document.getElementById('help').addEventListener('click', (e) => {
        e.preventDefault();
        alert('使用方法：\n\n1. 打开 YouTube 或 B站 视频\n2. 等待侧边栏自动出现\n3. 查看 AI 生成的金句和摘要\n4. 点击"导出笔记"保存为 Markdown\n\n注意：需要 Ollama 在本地运行');
    });
});

async function checkOllamaStatus() {
    const statusEl = document.getElementById('ollama-status');

    try {
        const response = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            signal: AbortSignal.timeout(2000)
        });

        if (response.ok) {
            statusEl.textContent = '✓ 运行中';
            statusEl.style.background = 'rgba(76, 175, 80, 0.5)';
        } else {
            statusEl.textContent = '✗ 未连接';
            statusEl.style.background = 'rgba(244, 67, 54, 0.5)';
        }
    } catch (error) {
        statusEl.textContent = '✗ 未运行';
        statusEl.style.background = 'rgba(244, 67, 54, 0.5)';
    }
}
