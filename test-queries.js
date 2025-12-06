
const { getTopSellingProducts } = require('./lib/supabase/queries');

async function test() {
    try {
        console.log('Fetching top selling products with limit 0...');
        const result = await getTopSellingProducts(30, 0);
        console.log('Top by Volume count:', result.topByVolume.length);
        console.log('Top by Revenue count:', result.topByRevenue.length);

        const zeroSales = result.topByVolume.filter(p => p.total_volume_sold === 0);
        console.log('Products with 0 volume sold:', zeroSales.length);

        if (zeroSales.length > 0) {
            console.log('Sample zero sales product:', zeroSales[0]);
        } else {
            console.log('No products with 0 sales found. Check if there are products in DB.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
