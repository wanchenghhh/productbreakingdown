import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const markedModule = process.env.TEARDOWN_MARKED_MODULE;
const { marked } = await import(markedModule ? pathToFileURL(markedModule).href : 'marked');
const pages = [
  { source: 'SKILL.md', file: 'index.html', title: '拆解流程', intro: '从真实任务出发，用证据还原 AI 产品如何交付结果。' },
  { source: 'references/evidence.md', file: 'evidence.html', title: '取证与二次验证', intro: '先分清哪些已经确认，再为待核实的信息补齐证据。' },
  { source: 'references/agent-analysis.md', file: 'agent-analysis.html', title: 'Agent 深度分析', intro: '先看整体执行，再拆协作分工与关键 Agent。' },
  { source: 'references/outputs.md', file: 'outputs.html', title: '输出与验收', intro: '飞书、Markdown 和 HTML 共用一套分析标准。' },
];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
await mkdir(path.join(root, 'docs'), { recursive: true });
const css = `:root{color-scheme:light;--ink:#172b3a;--muted:#536672;--line:#dbe3e8;--accent:#176d72}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f7f8f6;color:var(--ink);font-size:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;line-height:1.85}.wrap{max-width:1180px;margin:auto;padding:0 32px}header{border-bottom:1px solid var(--line);background:white}.bar{display:flex;justify-content:space-between;align-items:center;gap:24px;padding-top:20px;padding-bottom:20px}.brand{font-size:19px;font-weight:750;text-decoration:none;color:var(--ink)}.tag{font-size:12px;letter-spacing:.08em;color:var(--muted)}a{color:var(--accent);text-underline-offset:4px}a:hover{color:#103e42}.hero{padding:48px 0 36px}.eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700}.hero h1{font-size:clamp(30px,4vw,44px);line-height:1.3;margin:12px 0}.hero p{color:var(--muted);max-width:720px;margin:0}.layout{display:grid;grid-template-columns:210px minmax(0,1fr);gap:48px;align-items:start;padding-bottom:64px}nav{position:sticky;top:24px;display:flex;flex-direction:column;gap:6px}nav a{padding:9px 12px;border-radius:6px;text-decoration:none;color:var(--muted)}nav a[aria-current=page]{background:#e6eeee;color:#125458;font-weight:650}.download{margin-top:20px;border-top:1px solid var(--line);padding-top:16px;display:flex;flex-direction:column;gap:8px}.download a{font-size:14px}article{background:white;border:1px solid var(--line);padding:32px 40px;border-radius:8px;min-width:0}article>h1:first-child{margin-top:0;font-size:27px}h2{font-size:23px;margin:42px 0 16px;border-top:1px solid var(--line);padding-top:24px}h3{font-size:18px;margin:28px 0 10px}p{margin:14px 0}li{margin:7px 0}code{background:#eef2f3;border-radius:3px;padding:2px 5px;font-size:.9em;overflow-wrap:anywhere}pre{background:#eef2f3;overflow:auto;padding:18px;border-radius:6px}pre code{padding:0}table{display:block;overflow:auto;border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid var(--line);padding:10px 13px;text-align:left;vertical-align:top;min-width:110px}th{background:#edf2f3}footer{border-top:1px solid var(--line);padding:24px 0;font-size:13px;color:var(--muted)}.skip{position:absolute;left:16px;top:-100px;background:white;padding:10px}.skip:focus{top:10px}a:focus-visible{outline:3px solid #37999e;outline-offset:3px}@media(max-width:760px){.wrap{padding:0 20px}.bar{align-items:flex-start}.tag{display:none}.hero{padding:32px 0 24px}.layout{grid-template-columns:1fr;gap:20px}nav{position:static;flex-direction:row;flex-wrap:wrap;gap:4px}nav a{padding:7px 10px;font-size:14px}.download{margin:8px 0 0;width:100%;flex-direction:row;flex-wrap:wrap;gap:16px;padding-top:12px}.download a{padding:0}article{padding:22px 20px}h2{font-size:21px}ol,ul{padding-left:22px}}@media print{header,nav,.hero,.skip{display:none}.layout{display:block}.wrap{max-width:none;padding:0}body{background:white}article{border:0;padding:0}a{color:inherit}h2,h3{break-after:avoid}tr{break-inside:avoid}}`;
await writeFile(path.join(root, 'docs/styles.css'), css);
for (const page of pages) {
  let md = await readFile(path.join(root, 'ai-product-teardown', page.source), 'utf8');
  md = md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  for (const dest of pages) {
    const relative = path.posix.relative(path.posix.dirname(page.source), dest.source);
    md = md.replaceAll(`](${relative})`, `](${dest.file})`);
  }
  const nav = pages.map(p => `<a href="${p.file}"${p.file === page.file ? ' aria-current="page"' : ''}>${escape(p.title)}</a>`).join('');
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(page.intro)}"><title>${escape(page.title)} · AI 产品拆解 Skill</title><link rel="stylesheet" href="styles.css"></head><body><a class="skip" href="#content">跳转到正文</a><header><div class="wrap bar"><a class="brand" href="index.html">AI 产品拆解 Skill</a><span class="tag">AI PRODUCT TEARDOWN · V1</span></div></header><div class="wrap"><section class="hero"><div class="eyebrow">方法论与使用指南</div><h1>${escape(page.title)}</h1><p>${escape(page.intro)}</p></section><div class="layout"><nav aria-label="文档导航">${nav}<div class="download"><a href="ai-product-teardown.zip" download>下载完整 Skill ↗</a><a href="https://github.com/wanchenghhh/productbreakingdown">GitHub 源码 ↗</a></div></nav><main id="content"><article>${marked.parse(md)}</article></main></div></div><footer><div class="wrap">网页内容从 Skill 源文件生成 · 已经明确确认 / 待确认核实 · 支持网页与手机 App</div></footer></body></html>`;
  await writeFile(path.join(root, 'docs', page.file), html);
}
// Explicit file list keeps local OS metadata out of the distributable.
const files = ['SKILL.md', 'agents/openai.yaml', ...pages.slice(1).map(p => p.source)];
const python = process.env.TEARDOWN_PYTHON || 'python3';
execFileSync(python, ['-c', 'import sys,zipfile; from pathlib import Path; r=Path(sys.argv[1]); z=zipfile.ZipFile(r/"ai-product-teardown.zip","w",zipfile.ZIP_DEFLATED); [z.write(r/"ai-product-teardown"/n,"ai-product-teardown/"+n) for n in sys.argv[2:]]; z.close()', root, ...files]);
await copyFile(path.join(root, 'ai-product-teardown.zip'), path.join(root, 'docs/ai-product-teardown.zip'));
await writeFile(path.join(root, 'docs/.nojekyll'), '');
console.log(`Built ${pages.length} documentation pages and Skill download.`);
