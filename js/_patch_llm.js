// 临时脚本：更新 llm.js
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'js/llm.js');
let c = fs.readFileSync(file, 'utf8');
// TODO: patch1 - script compat
// TODO: patch2 - append stream + rewrite
fs.writeFileSync(file, c, 'utf8');
console.log('done, lines:', c.split('\n').length);
