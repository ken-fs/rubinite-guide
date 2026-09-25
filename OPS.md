# Rubinite Guide — Steam 工具站模式测试

> 建档 2026-09-25 · 目的：**验证「Steam 工具/数据库站」模式是否可行**（低成本 2 页试探）

---

## 一、测试假设

**假设**：Steam 热门游戏有 wiki.gg/Fandom 覆盖攻略，但**不做交互工具/深度数据**；
新站以「数据 + 工具」切入可绕过 wiki 竞争。

**判据（2-4 周后）**：
- ✅ 成功：任一页进 Google 前 10（对 `rubinite boss list` / `rubinite talismans` 等词）或 GSC 有自然点击
- ❌ 失败：4 周内零收录 / 排名 >50 → 关闭，Steam 模式降级

---

## 二、站点档案

| 项 | 值 |
|---|---|
| 域名 | **rubinite.xyz** ✅ 已注册（2026-09-25，¥13.83/年；.guide 要 ¥222 所以选了 .xyz）|
| Worker | `rubinite-guide` ✅ 已部署 |
| 正式 | ✅ **https://rubinite.xyz**（+ workers.dev 预览）|
| 仓库 | ✅ https://github.com/ken-fs/rubinite-guide |
| 技术 | 纯静态 HTML + 内联 CSS（2 页）——测试站不套模板 |
| 页面 | `/`（boss 名单+难度）· `/talismans/`（29 talisman + 4 build）|

## 三、内容与数据源

| 页 | 内容 | 数据源 |
|---|---|---|
| `/` | 13 个唯一 boss（10 幻象 + 13 真实 = 23 场）/ HP / 阶段 / 位置 / 招式 / 掉落 / 难度排名 | rubinite.wiki.gg（MediaWiki API 全量）+ 机制文档 |
| `/talismans/` | 29 个 talisman 全表（槽位/效果/来源）+ 4 套 build（早期/中期/Real/刷 boss） | 同上 |

**SEO 齐备**：canonical · OG · FAQ schema ×2 · sitemap.xml · robots.txt · 404

## 四、竞品

| 竞品 | 体量 | 成色 |
|---|---|---|
| rubinite.wiki.gg | **26 页**（13 boss + 物品页）| 小而精（boss 页有 infobox）|
| YouTube | "All Bosses" 视频 **128K / 29K / 14K** 播放 | 强（boss rush 玩家看视频）|
| weareplaystation.fr | boss 攻略（法语）| 单站 |
| Steam Community | 游戏 hub | 一手 |

## 五、接线记录（全部完成 2026-09-25）

| 步骤 | 方式 |
|---|---|
| 域名注册 | Spaceship 网页（用户付款，¥13.83）|
| NS → Cloudflare | `spaceship.mjs ns`（API，端点需 provider:"custom"）|
| CF zone 创建 + 激活检查 | **Cloudflare MCP**（full access token 能跑 activation_check，wrangler OAuth 不行）|
| Worker 部署 + 绑域名 | `wrangler deploy`（routes 在 wrangler.jsonc）|
| GSC 属性 | 用户手动加 + 服务账号 Owner |
| sitemap 提交 | `node scripts/gsc.mjs sitemaps` ✅ |
| 舰队表 / 验收基线 / Clash 白名单 | 已加 |

**已知问题**：本地 Playwright 访问 rubinite.xyz 报 NAME_NOT_RESOLVED（Clash fake-IP 未刷新，重启 Clash 生效；curl 与外部访问正常）

## 六、衡量方式

```bash
# 2 周后跑
node scripts/gsc.mjs report 14 <站点名>
node scripts/gsc.mjs inspect "https://rubinite.guide/"
# 或直接看排名
cd game-name-radar && node lib/steam-gate.mjs "Rubinite"   # 复查工具需求是否还在
```
