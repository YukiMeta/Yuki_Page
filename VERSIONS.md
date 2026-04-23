# Yuki Peng Portfolio - 版本管理记录

## 分支结构

```
main              - 当前稳定版本
archive/v1-stable - 2026.04 极简主义版本（纯 HTML/CSS/JS）
dev/experimental  - 实验性功能测试
```

## 版本历史

### v1.0 - 极简主义重构（2026-04-19）
- 720px 窄版布局
- 衬线字体 + 无衬线正文
- 黑白灰配色
- 纯 HTML/CSS/JS
- 部署地址：https://www.yukipeng.com

### v2.0 - React 实验（2026-04-23，已回退）
- React + Framer Motion
- 滚动动画
- 88px 大标题
- 问题：过于技术化，失去女性细腻感

---

## 设计进化方向

### 参考网站
| 网站 | 特点 | 借鉴点 |
|------|------|--------|
| departuremono.com | 像素字体 + 拼贴画 | 11px 基础字号、弹性动画曲线 |
| Shopify 26winter | 科技人文主义 | 古典油画质感 |
| LANCH | 留白排版 | 杂志级排版 |

### 核心差距分析
1. **字体性格** - 需要更有辨识度的字体（像素/等宽）
2. **色彩情感** - 14 色命名系统 vs 黑白灰
3. **交互密度** - 粒子/随机/拖拽 vs 简单 hover
4. **拼贴感** - 绝对定位装饰元素 vs 网格布局

---

## 快速部署命令
```bash
# 部署主分支
vercel --prod

# 本地开发
npm run dev

# 构建测试
npm run build
```

## Git 工作流
```bash
# 创建新版本分支
git checkout -b release/v1.x

# 回退到指定版本
git reset --hard <commit-hash>
git push --force

# 保存当前状态
git branch archive/backup-<date>
```
