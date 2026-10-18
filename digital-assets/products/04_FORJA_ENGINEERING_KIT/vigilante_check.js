#!/usr/bin/env node
const fs=require('fs');const p=process.argv[2];
if(!p||!fs.existsSync(p)){console.error('BLOQUEADO: falta archivo');process.exit(2)}
const st=fs.statSync(p);const t=fs.readFileSync(p,'utf8');
if(st.size<5000){console.error('BLOQUEADO: demasiado pequeño');process.exit(3)}
if(/rm\s+-rf\s+[\/~]/.test(t)){console.error('BLOQUEADO: denylist');process.exit(4)}
console.log('OK vigilante',p,st.size);
