import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Manual ENV parsing for .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) env[key.trim()] = value.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    const constantsPath = path.join(process.cwd(), 'constants.tsx');
    const content = fs.readFileSync(constantsPath, 'utf8');
    
    const match = content.match(/export const MOCK_PRODUCTS: any\[\] = (\[[\s\S]*?\]);/);
    if (!match) {
        console.error('Could not find MOCK_PRODUCTS in constants.tsx');
        return;
    }

    // Since we are in ESM, we can't easily 'require' the tmp file.
    // I'll use a safer approach: regex cleanup to JSON.
    // This is risky but since I have the content, I can try to make it valid JSON.
    let jsonStr = match[1]
        .replace(/\/\/.*$/gm, '') // remove comments
        .replace(/id:/g, '"id":')
        .replace(/name:/g, '"name":')
        .replace(/label:/g, '"label":')
        .replace(/shortDesc:/g, '"shortDesc":')
        .replace(/price:/g, '"price":')
        .replace(/originalPrice:/g, '"originalPrice":')
        .replace(/image:/g, '"image":')
        .replace(/category:/g, '"category":')
        .replace(/features:/g, '"features":')
        .replace(/botanicals:/g, '"botanicals":')
        .replace(/ritual:/g, '"ritual":')
        .replace(/results:/g, '"results":')
        .replace(/title:/g, '"title":')
        .replace(/desc:/g, '"desc":')
        .replace(/icon:/g, '"icon":')
        .replace(/percentage:/g, '"percentage":')
        .replace(/text:/g, '"text":')
        .replace(/'/g, '"') // replace single quotes with double quotes
        .replace(/,\s*\]/g, ']') // remove trailing commas
        .replace(/,\s*\}/g, '}'); // remove trailing commas

    let MOCK_PRODUCTS;
    try {
        MOCK_PRODUCTS = JSON.parse(jsonStr);
    } catch (e) {
        console.error('Manual JSON parse failed, trying fallback...');
        // Fallback: use eval() in a controlled way if needed, 
        // but for now let's hope the regex worked.
        // Actually, I'll just use the first few products I already have if it fails.
        throw e;
    }

    console.log(`Found ${MOCK_PRODUCTS.length} products to migrate.`);

    const categoriesSet = new Set(MOCK_PRODUCTS.map(p => p.category));
    const categoriesMap = {};

    for (const catName of categoriesSet) {
        const slug = catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]/g, '');
        const { data, error } = await supabase.from('categories').upsert({
            name: catName,
            slug: slug
        }, { onConflict: 'slug' }).select('id').single();
        
        if (error) {
            console.error(`Error upserting category ${catName}:`, error.message);
            const { data: existing } = await supabase.from('categories').select('id').eq('slug', slug).single();
            if (existing) categoriesMap[catName] = existing.id;
        } else {
            categoriesMap[catName] = data.id;
        }
    }

    for (const p of MOCK_PRODUCTS) {
        const productData = {
            name: p.name,
            slug: p.id,
            short_description: p.label,
            description: p.shortDesc,
            price: p.price,
            base_price: p.price,
            images: [p.image],
            category_id: categoriesMap[p.category],
            status: 'published',
            features: p.features || [],
            botanicals: p.botanicals || [],
            ritual: p.ritual || [],
            results: p.results || [],
            stock: 100
        };

        const { error } = await supabase.from('products').upsert(productData, { onConflict: 'slug' });
        
        if (error) {
            console.error(`Error migrating product ${p.name}:`, error.message);
        } else {
            console.log(`Migrated ${p.name}`);
        }
    }

    console.log('Migration complete!');
}

migrate().catch(console.error);
