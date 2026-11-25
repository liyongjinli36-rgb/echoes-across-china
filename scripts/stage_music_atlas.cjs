'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname,'..');
const runtime = [
  'index.html','LICENSE','CREDITS.md',
  'css/style.css','css/music-atlas.css',
  'js/app.js','js/atlas_snapshots.js','js/china_geo_data.js',
  'js/i18n_dict.js','js/music-atlas.js','js/music-era-data.js','js/music-i18n.js','js/music-registry.js',
  'data/era-map-config.json','data/music',
  'assets/favicon.svg','assets/terrain_relief.webp','assets/terrain_relief_mobile.webp',
  'assets/terrain',
  ...JSON.parse(fs.readFileSync(path.join(root,'data/music/records.json'),'utf8'))
    .filter(record => record.media?.file).map(record => record.media.file),
];

const source = [
  ...runtime, 'README.md', '.gitignore', '.github/workflows/ci.yml',
  '.github/workflows/deploy-pages.yml', 'data/atlas', 'js/atlas_boot.js', 'js/snapshots',
  'scripts/build_atlas.js', 'scripts/import_music_register.py', 'scripts/check_music_atlas.cjs', 'scripts/stage_music_atlas.cjs',
];

function stage(name, files) {
  const target = path.join(root, name);
  const marker = '.music-atlas-' + name;
  if (fs.existsSync(target) && !fs.existsSync(path.join(target,marker))) {
    throw new Error(`${name} exists and was not created by this script.`);
  }

  fs.mkdirSync(target,{recursive:true});
  fs.writeFileSync(path.join(target,marker),'');
  for (const file of files) {
    const destination = path.join(target,file);
    fs.mkdirSync(path.dirname(destination),{recursive:true});
    fs.cpSync(path.join(root,file),destination,{recursive:true});
  }

  const allowed = [...files,marker];
  function verify(directory) {
    for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
      const file = path.join(directory,entry.name);
      const relative = path.relative(target,file).split(path.sep).join('/');
      const covered = allowed.some(item=>relative === item || relative.startsWith(item + '/'));
      if (covered) continue;
      if (entry.isDirectory() && allowed.some(item=>item.startsWith(relative + '/'))) verify(file);
      else throw new Error(`Unexpected file in ${name}: ${relative}`);
    }
  }
  verify(target);
  console.log(`Music atlas staged in ${name}.`);
}

if (process.argv.includes('--source')) stage('source-release', source);
else stage('dist', runtime);
