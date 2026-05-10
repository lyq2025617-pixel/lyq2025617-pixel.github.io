import pathlib

css_path = pathlib.Path('css/style.css')
css = css_path.read_text(encoding='utf-8')

# ═══ Unified timeline CSS: flexbox for internal layout + right-side line + dot ═══

# 1. Replace the main timeline block (line ~1576)
OLD_MAIN = '''/* 活动流程时间线 — 右侧线 + 实星圆 */
.process-timeline {
  position: relative;
  padding: 0 28px 0 0;
}
.process-timeline::before {
  content: '';
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #12B76A 0%, #34d399 100%);
  border-radius: 2px;
}
.process-item {
  position: relative;
  margin-bottom: 20px;
  padding: 0 36px 0 0;
}'''

NEW_MAIN = '''/* 活动流程时间线 — 右侧线 + 实星圆 */
.process-timeline {
  position: relative;
  padding-right: 36px;
}
.process-timeline::before {
  content: '';
  position: absolute;
  right: 14px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #12B76A 0%, #34d399 100%);
  border-radius: 2px;
}
.process-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
  padding-right: 24px;
}'''

if OLD_MAIN in css:
    css = css.replace(OLD_MAIN, NEW_MAIN)
    print('1. main timeline block: OK')
else:
    print('1. main timeline block: NOT FOUND')

# 2. Replace the override at line ~795
OLD_OVERRIDE = '''/* ── 19. 活动流程时间线 — 改为右侧实星圆 ── */
.process-item::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #12B76A;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px rgba(18,183,106,0.25);
  z-index: 2;
}'''

NEW_OVERRIDE = '''/* ── 19. 活动流程时间线 — 右侧实星圆 ── */
.process-item::before {
  content: '';
  position: absolute;
  right: 4px;
  top: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #12B76A;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px rgba(18,183,106,0.25);
  z-index: 2;
}'''

if OLD_OVERRIDE in css:
    css = css.replace(OLD_OVERRIDE, NEW_OVERRIDE)
    print('2. dot override: OK')
else:
    print('2. dot override: NOT FOUND')

# 3. Fix .result-card-body .process-timeline
css = css.replace(
    '.result-card-body .process-timeline {\n  padding: 0 28px 0 0;\n}',
    '.result-card-body .process-timeline {\n  padding-right: 36px;\n}'
)
css = css.replace(
    '.result-card-body .process-timeline {\n  padding: 0;\n}',
    '.result-card-body .process-timeline {\n  padding-right: 36px;\n}'
)
print('3. result-card-body timeline: OK')

# 4. Remove the conflicting flex rule at line ~2573
css = css.replace(
    '.process-item { display: flex; align-items: flex-start; gap: 8px; }',
    '/* process-item flex layout is defined in timeline block */'
)
print('4. removed duplicate flex rule')

css_path.write_text(css, encoding='utf-8')
print('Done')
