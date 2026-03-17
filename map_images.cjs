const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, 'constants.tsx');
let content = fs.readFileSync(constantsPath, 'utf8');

const imageMap = {
    'triphala-churna': '/images/TriphalaChurna_2.png',
    'yummunity': '/images/Yummunity Bottle.png',
    'trip-caps': '/images/Tripcaps_1.png',
    'widari-forte': '/images/WidariForte_2.png',
    'thyrogard': '/images/Thyro_1.png',
    'suventris': '/images/Suventris_1.png',
    'redema': '/images/Redema_2.png',
    'pyril-ds': '/images/PyrilDS_2.png',
    'orthoraksha': '/images/OrthoRaksha_2.png',
    'mahanarayana': '/images/MahanarayanaTaila_1.png',
    'nilomit': '/images/Nilomit_2..png',
    'daily-dew': '/images/Daily Dew.png',
    'madhuchari-churna': '/images/MadhumehariChurna_2.png',
    'laksha-capsules': '/images/Laksha_1.png',
    'hepableen-syrup': '/images/HAPABLEEN 3.jpg',
    'hepableen-tablets': '/images/Hepableen Tablets.png',
    'livercure': '/images/Livercure_2.png',
    'combifore': '/images/Combifore_2.png',
    'gtp-mental-fitness': '/images/GTP_1.png',
    'aa-caps': '/images/AAcaps_1.png',
    'd-tabs': '/images/Dtabs_2.png',
    'cyst-evit': '/images/Cyst_1.png',
    'bff-balm': '/images/BFF_1.png',
    'uvsafe-sunscreen': '/images/UVSafe.png',
    'timeless-anti-ageing': '/images/Timeless.png',
    'soft-lips': '/images/SoftLips_1.png',
    'kumkumadi-serum': '/images/Kumkumadi Serum.jpeg',
    'keshpro-oil': '/images/KeshPro.png',
    'glow-complexion-cream': '/images/Glow.png',
    'flawless-pack': '/images/Flawless.png'
};

// Regex to find each product block and replace its image string if it exists in the map
const productRegex = /id:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g;

content = content.replace(productRegex, (match, id, oldImage) => {
    if (imageMap[id]) {
        return match.replace(oldImage, imageMap[id]);
    }
    return match;
});

fs.writeFileSync(constantsPath, content, 'utf8');
console.log('Updated constants.tsx with real images.');
