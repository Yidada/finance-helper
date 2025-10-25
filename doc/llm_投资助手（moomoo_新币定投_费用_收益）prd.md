# 项目名称
LLM 投资助手（moomoo 新币定投 + 费用 + 收益）

## 摘要（Executive Summary）
构建一套面向个人投资者的 LLM 助手，支持以 **新币（SGD）在 moomoo 平台**按月定投 **QQQ、TLT、03032、DBS** 等标的的**费用测算、收益测算**与**可视化汇总**。助手可在对话中收集参数、拉取/校验历史绩效数据、应用 moomoo 新加坡费表（含 9% GST、市场监管费项）、模拟汇率点差，并输出 **1/3/5/10 年期**的 **净年化、期末市值与收益**，并支持导出 CSV/Excel 报表。

---

## 目标（Goals）
1. **一问一答完成测算**：用户输入“每月投入”“标的列表”“期限”，助手返回**净年化/期末市值/成本**等核心结果。
2. **moomoo 费表落地**：固化美股/港股/新交所下 **显性费用**（佣金/平台/监管 + 9% GST）与**ETF 免印花**等规则，并允许版本化更新。
3. **汇率点差建模**：对非 SGD 标的，允许用户设置 **FX 点差（如 0.30%/单）**，纳入年化与收益。
4. **绩效口径统一**：默认使用 **发行方或权威平台的“总回报（含分红再投）年化”** 作为收益基线；必要时支持**逐月精算**（DCA IRR）。
5. **可导出 & 复用**：一键导出 **CSV/Excel**；生成**可复制 MD/HTML**报告。

## 非目标（Non-Goals）
- 不提供投资建议与个股/ETF 推荐排序。
- 不直接下单交易或替用户改动券商设置。
- 不对未来收益做保证；仅做历史数据与用户设定参数下的**工程化测算**。

---

## 用户画像（Personas）
- **Benjamin（核心用户）**：新加坡长期投资者，月度定投、重视费用透明，善用表格与批量导出，偏好 TypeScript 技术栈。
- **进阶用户**：希望切换回测窗口、替换标的（如 QQQM、VGT、KTEC、KWEB）、自定义费表/汇率。

## 关键场景（User Stories）
1. *作为用户*，我输入：每月 S$1,000，标的：QQQ/TLT/03032/DBS，期限：1/3/5/10 年 → 得到**显性费用、含 FX 的总成本、净年化、期末市值、累计收益**。
2. *作为用户*，我修改 FX 点差从 0.30%→0.50%，或把月投入改为 S$2,000 → 一键**重新测算并导出** CSV。
3. *作为用户*，我查看**口径说明**：年化来源、ETF 已含 TER/OCF、moomoo 费项与 GST 适用范围、ETF 免印花税（港股）。

---

## 依赖与数据源（Data Sources & Freshness）
- **业绩数据（总回报年化）**：发行方官网（Invesco、iShares、恒生投管/FT/Morningstar 等）。
- **费用规则**：moomoo 新加坡费表（美股/港股/SGX 的平台费、佣金、监管费、GST；港股 ETF 免印花）。
- **汇率**：用户输入或来自权威快照（仅用于折算展示；百分比费率不受影响）。
- **新鲜度策略**：
  - 默认以**最近披露月/季**的总回报数据为基线；显示“截至日”。
  - 费表版本化存储：记录 **生效日期**、**市场**、**费项名**、**计算公式**。

---

## 指标与验收（Success Metrics）
- **数值一致性**：对比手工表格或权威计算器，**订单费用**误差 ≤ **S$0.05/单**；**净年化**误差 ≤ **0.25 个百分点**（相对基线）。
- **可解释性**：所有输出都带**口径与公式**链接/摘要。
- **时效**：默认查询/计算响应 < **2s**（不含外部抓取）。

---

## 功能需求（Functional Requirements）
### F1. 标的配置
- 内置 4 个标的：**QQQ、TLT、03032、DBS（D05.SI）**。
- 字段：`ticker`、`market`（US/HK/SGX）、`currency`（USD/HKD/SGD）、`type`（ETF/Stock）、`hasTER`（ETF=true）。

### F2. 费用引擎（moomoo SG）
- **美股（QQQ/TLT）**：`commission=0`；`platform=US$0.99/单`；`GST=9%` 仅对平台费；买入**无 SEC/TAF**。
- **港股（03032，ETF）**：`commission=0.03%（min HK$3）`；`platform=HK$15/单`；`GST=9%`（**仅平台费**）；`tradingFee=0.00565%`，`SFC=0.0027%`，`AFRC=0.00015%`，`settlement=0.0042%`；**印花税=0%（ETF 免）**。
- **新交所（DBS）**：`commission=0.03%（min S$0.99）`；`platform=0.03%（min S$0.99）`；`clearing=0.0325%`；`trading=0.0075%`；`GST=9%` 适用以上费用。
- 可维护表结构：`MarketFeeRule{ market, item, rate, min, cap, gstApplies }`；支持**生效日期**与**回滚**。

### F3. 汇率点差模型
- 对 **USD/HKD 标的**，支持每单 **FX 点差（默认 0.30%）**；纳入**年化与收益**。
- 允许用户改为固定 **SGD→USD/HKD 报价**或以**市场价±点差**计算。

### F4. 收益引擎
- **模式 A（快速）**：使用**年化总回报（含分红再投）**作为基线，换算为**月收益率** → 按**等额月定投**年金公式计算期末市值。
- **模式 B（精算）**：逐月历史：价格/净值 + 分红 + 汇率（SGD 基点） → 逐月现金流 IRR 与期末市值（可切换 NAV/收盘）。
- **注意**：ETF 年化已内含 **TER/OCF**；股票（DBS）无基金费；我们另行扣减**券商显性费用**与**FX 点差**。

### F5. 报表与导出
- 表格：每标的 × 1/3/5/10 年 **投入/费用/净年化/期末市值/收益**（口径 A 与 B 并列）。
- 组合汇总：合计投入、合计期末市值、合计收益（10 年不含 03032）。
- 导出：**CSV、Excel（.xlsx）**；一键复制 **Markdown/HTML**。

### F6. 交互与提示
- 参数缺省：`monthlyContribution=1000 SGD`、`fxSpread=0.30%`、`tenors=[1,3,5,10]`。
- 自动补齐“截至日/数据源”并提示“历史测算非建议”。

---

## 计算与公式（Formulas）
### 年金终值（等额月定投）
- 月收益率：`r_m = (1 + r_y)^(1/12) - 1`
- 期末市值：`FV = P * [((1+r_m)^n - 1) / r_m] * (1 + r_m)`
- 累计投入：`Invested = P * n`
- 收益：`Gain = FV - Invested`

### 费用年化拖累近似（用于模式 A）
- 以“**显性费用/年投入（S$12k）**”近似为**固定年化拖累**：
  - QQQ/TLT：**~0.147%/年**；03032：**~0.352%/年**；DBS：**~0.259%/年**。
- FX 点差：对 USD/HKD 标的**再减**设定的 **x%/年**（默认 0.30%）。

### 精算模式（模式 B）
- 逐月现金流 `CF_t = -P*(1+FXspread) - 显性当次费用`；
- 资产端：按月收益（含分红再投）/月度净值演进；
- 终值 `FV` 与 **IRR**：解 `NPV=0` 的月度内部收益率，换算年化。

---

## 数据模型（建议 TypeScript）
```ts
// 标的与配置
interface Instrument {
  ticker: string;        // 'QQQ' | 'TLT' | '03032' | 'D05.SI'
  market: 'US' | 'HK' | 'SGX';
  currency: 'USD' | 'HKD' | 'SGD';
  type: 'ETF' | 'Stock';
  terIncluded?: boolean; // ETF = true
}

interface FeeRule { market: 'US'|'HK'|'SGX'; item: string; rate?: number; min?: number; cap?: number; gstApplies: boolean; }

interface RunParams {
  monthlyContributionSGD: number; // per instrument
  tenors: number[];               // years
  fxSpreadPct: number;            // per year, for USD/HKD
  feeRules: FeeRule[];            // versioned
  annualizedReturns: Record<string, Record<'1Y'|'3Y'|'5Y'|'10Y', number|null>>; // %
}

interface ResultRow {
  instrument: string; tenor: '1Y'|'3Y'|'5Y'|'10Y'; invested: number; fvA: number; fvB: number; netAnnA: number; netAnnB: number; notes?: string; asOf?: string;
}
```

---

## API 草案
- `POST /simulate/dca`：输入 `RunParams`，返回逐标的与组合汇总。
- `GET /fees/:market`：返回当前费表；支持 `?at=YYYY-MM-DD` 历史快照。
- `GET /returns/:ticker`：返回总回报年化与“截至日/来源”。
- `POST /export`：接受结果 JSON，返回 CSV/Excel。

---

## 示例 I/O（模式 A）
**Request**
```json
{
  "monthlyContributionSGD": 1000,
  "tenors": [1,3,5,10],
  "fxSpreadPct": 0.30,
  "annualizedReturns": {
    "QQQ": {"1Y": 23.63, "3Y": 31.79, "5Y": 17.34, "10Y": 20.32},
    "TLT": {"1Y": -4.89, "3Y": -0.81, "5Y": -8.77, "10Y": -0.59},
    "03032": {"1Y": 25.77, "3Y": 17.67, "5Y": -5.00, "10Y": null},
    "DBS": {"1Y": 40.0, "3Y": 38.0, "5Y": 28.5, "10Y": 16.0}
  }
}
```
**Response（片段）**
```json
{
  "rows": [
    {"instrument":"QQQ","tenor":"5Y","invested":60000,"fvA":? ,"fvB":?,"netAnnA":17.19,"netAnnB":16.89,"asOf":"2025-09-30"},
    {"instrument":"03032","tenor":"5Y","invested":60000,"fvA":? ,"fvB":?,"netAnnA":-5.35,"netAnnB":-5.65,"asOf":"2025-10-23"}
  ],
  "portfolio": {"1Y": {...}, "3Y": {...}, "5Y": {...}, "10Y": {"note":"不含03032"}}
}
```

---

## 前端与可视化（建议）
- **Tech**：Next.js + TypeScript + Tailwind；图表用 `recharts`。
- **模块**：参数面板（投入/FX/期限/标的选择/费表版本）、结果卡片（逐标的）、组合汇总、导出按钮、口径说明抽屉。
- **图表**：期末市值与累计收益柱状图；费用分解堆叠图；情景对比（FX 0.2%/0.5%）。

---

## 国际化与本地化
- 默认中文，支持英文（单位/货币格式化按 `Intl`）。
- 标的显示支持本地交易所代码：`QQQ (NASDAQ)`、`TLT (NASDAQ)`、`03032 (HKEX)`、`DBS D05.SI (SGX)`。

---

## 法务与合规（Disclaimers）
- 本工具仅用于**教育与估算**，非投资建议；历史回报不代表未来表现。
- 费表与市场规则会变动，请以券商与交易所公告为准；我们提供**截至日**与**版本号**。

---

## MVP 范围与里程碑
**M0（1 周）**：费用引擎（US/HK/SGX），模式 A 计算器，基础表格与导出。
**M1（2 周）**：模式 B 精算（逐月 DCA IRR）、汇率快照、口径说明抽屉、组合汇总图表。
**M2（1 周）**：自定义标的库、费表可视化、回测窗口选择、结果快照分享（MD/HTML）。

---

## 测试与验收用例（部分）
1. **费用单测**：US 平台费 $0.99 + 9% GST → 折合 SGD 结果与手工一致（误差 ≤ S$0.01）。
2. **港股 ETF**：印花税为 0%；当月交易额很小，佣金 `min HK$3` 生效。
3. **净年化**：QQQ 10 年 `20.32%` 基线，扣 `0.147%` 显性费后输出 `≈20.17%`。
4. **组合 10 年**：自动排除 03032。
5. **边界**：`r=0` 时年金公式退化为 `P*n`；小数精度保留两位。

---

## 风险与应对
- **数据差异**：不同平台的“Trailing/Annualized”口径差异 → 在 UI 明示来源与“截至日”。
- **费表调整**：监管费率变动 → 版本化 FeeRule，运行时按日期选择。
- **FX 不确定**：点差随时段变化 → 允许区间（0.2–0.5%）情景对比。

---

## 附：默认参数与当前基线（可在 UI 中展示）
- 月投：**S$1,000/标的**；期限：**1/3/5/10 年**；FX 点差：**0.30%/单**。
- 年化基线（截至最近披露）：
  - QQQ：`1Y 23.63 / 3Y 31.79 / 5Y 17.34 / 10Y 20.32`（NAV，总回报）。
  - TLT：`1Y -4.89 / 3Y -0.81 / 5Y -8.77 / 10Y -0.59`（总回报）。
  - 03032：`1Y 25.77 / 3Y 17.67 / 5Y -5.00 / 10Y N/A`（总回报）。
  - DBS（暂估）：`1Y ~40 / 3Y ~38 / 5Y ~28.5 / 10Y ~16`（SGD 总回报，后续可切换为精算或官方口径）。

---

## 开放问题（Open Questions）
1. DBS 的 1/3/5/10 年“含分红再投”是否统一采用 **Morningstar SGD 总回报** 口径？
2. 是否需要支持更多对标（如 QQQM/VGT/FTEC、KTEC/KWEB、CQQQ），以及“含 META/GOOGL 的全科网域 vs 纯 IT 板块”的开关？
3. 是否接入**自动抓取**（定时刷新）还是采用**人工确认后写入版本库**？

— End —

