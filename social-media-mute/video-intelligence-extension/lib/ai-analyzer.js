// AI Analyzer - 调用 Ollama 进行内容分析
class AIAnalyzer {
  constructor(ollamaUrl = 'http://localhost:11434', model = 'qwen2.5-coder:7b') {
    this.ollamaUrl = ollamaUrl;
    this.model = model;
  }

  async callOllama(prompt) {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return null;
    }
  }

  async extractKeyQuotes(subtitles, maxQuotes = 5) {
    const prompt = `角色：你是一个专业的内容分析师

任务：从以下视频字幕中提取 ${maxQuotes} 个最有价值的金句或关键观点

要求：
1. 选择最核心、最有洞察力的观点
2. 保留原文表达（如果是英文，翻译成中文）
3. 每个金句一行
4. 按重要性排序

字幕内容：
${subtitles.substring(0, 3000)}

输出格式（每行一个金句，不要编号）：
金句内容1
金句内容2
金句内容3`;

    const response = await this.callOllama(prompt);
    if (!response) return [];

    // 解析金句
    const quotes = response
      .split('\n')
      .filter(line => line.trim().length > 10)
      .slice(0, maxQuotes);

    return quotes;
  }

  async generateSummary(subtitles) {
    const prompt = `角色：你是一个专业的内容总结专家

任务：用3-5句话总结以下视频的核心内容

要求：
1. 突出主要观点和结论
2. 保留关键数据和例子
3. 语言简洁明了
4. 适合快速回顾

字幕内容：
${subtitles.substring(0, 3000)}

输出格式（每行一个要点，用 • 开头）：
• 要点1
• 要点2
• 要点3`;

    const response = await this.callOllama(prompt);
    if (!response) return '正在生成摘要...';

    return response;
  }

  async analyzeContent(subtitles) {
    console.log('[AI] 开始分析内容...');
    
    const [quotes, summary] = await Promise.all([
      this.extractKeyQuotes(subtitles),
      this.generateSummary(subtitles)
    ]);

    return {
      quotes,
      summary,
      timestamp: new Date().toISOString()
    };
  }
}

// 导出供其他脚本使用
if (typeof window !== 'undefined') {
  window.AIAnalyzer = AIAnalyzer;
}
