const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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
    
    // Simple regex extraction of MOCK_PRODUCTS array
    const match = content.match(/export const MOCK_PRODUCTS: any\[\] = (\[[\s\S]*?\]);/);
    if (!match) {
        console.error('Could not find MOCK_PRODUCTS in constants.tsx');
        return;
    }

    let jsContent = "const MOCK_PRODUCTS = " + match[1] + ";\nmodule.exports = { MOCK_PRODUCTS };";
    jsContent = jsContent.replace(/:\s*any\[\]/g, '');
    
    const tmpFile = path.join(process.cwd(), 'tmp_products.js');
    fs.writeFileSync(tmpFile, jsContent);
    
    const { MOCK_PRODUCTS } = require(tmpFile);
    fs.unlinkSync(tmpFile);

    console.log(`Found ${MOCK_PRODUCTS.length} products to migrate.`);

    // 1. Ensure Categories
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

    // 2. Insert Products
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
