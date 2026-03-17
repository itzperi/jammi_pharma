require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');

const supabaseUrl = 'https://icgkfeyqljdulhqfjfzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZ2tmZXlxbGpkdWxocWZqZnpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY4MDM4OCwiZXhwIjoyMDg5MjU2Mzg4fQ.6qZw5cp26lwH_JSQvFHVcyGdrFuKTdJlzYn5a58hp1g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase.from('products').select('id, name');
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  if (!products) {
    console.error("Products is null");
    return;
  }
  console.log("Found products:", products.length);
  
  const workbook = xlsx.readFile('c:\\Users\\itzme\\Downloads\\Bundles (1).xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  let headerIndex = -1;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    if (rows[i] && rows[i][0] === 'S. No.') {
      headerIndex = i;
      break;
    }
  }
  
  if (headerIndex === -1) {
      console.log("Could not find headers");
      return;
  }
  
  const bundlesData = [];
  
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[1]) continue;
    
    let bundleName = String(row[1]).trim();
    let description = row[2] ? String(row[2]).trim() : '';
    
    let skuNames = [];
    for (let j = 3; j < row.length; j++) {
      if (row[j] && typeof row[j] === 'string') {
        skuNames.push(row[j].trim());
      }
    }
    
    let productIds = [];
    let notFound = [];
    
    for (let sku of skuNames) {
      let match = products.find(p => p.name.toLowerCase() === sku.toLowerCase() || p.name.toLowerCase().includes(sku.toLowerCase()));
      if (match) {
        productIds.push(match.id);
      } else {
        notFound.push(sku);
      }
    }
    
    const randomDiscount = (Math.random() * (5 - 3) + 3).toFixed(2);
    
    // We'll insert these directly into Supabase bundles later, right now let's just log
    bundlesData.push({
      name: bundleName,
      description: description,
      product_ids: productIds,
      discount_percent: parseFloat(randomDiscount),
      active: true,
      image_url: '' // Will need a placeholder or first product image
    });
  }
  
  // Make sure table has description and image_url before inserting
  console.log("Parsed bundles:", bundlesData.length);
  // Log first bundle to check
  console.log("First bundle sample:", JSON.stringify(bundlesData[0], null, 2));
  
  // Perform alter table to ensure description and image_url exist!
  // NOTE: Supabase client can't blindly alter table. We'll do it with an RPC or via a db schema SQL file.
  
  // Let's insert them
  const { error: insertError } = await supabase.from('bundles').insert(bundlesData);
  if (insertError) {
    console.error("Insert error (could be missing columns):", insertError);
  } else {
    console.log("Successfully inserted", bundlesData.length, "bundles!");
  }
}

run().catch(console.error);
