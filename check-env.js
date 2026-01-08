/**
 * Environment Variables Checker
 * 
 * This script helps verify that all required environment variables
 * are properly configured for the application.
 * 
 * Run this with: node check-env.js
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

console.log('🔍 Checking Environment Variables...\n');

let allPresent = true;
let hasErrors = false;

requiredEnvVars.forEach(varName => {
    const value = process.env[varName];

    if (!value) {
        console.log(`❌ ${varName}: MISSING`);
        allPresent = false;
    } else {
        // Validate format
        if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
            if (!value.startsWith('https://') || !value.includes('supabase')) {
                console.log(`⚠️  ${varName}: Present but format looks incorrect`);
                console.log(`   Current value: ${value}`);
                console.log(`   Expected format: https://xxx.supabase.co`);
                hasErrors = true;
            } else {
                console.log(`✅ ${varName}: OK`);
            }
        } else if (varName === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
            if (!value.startsWith('eyJ')) {
                console.log(`⚠️  ${varName}: Present but format looks incorrect`);
                console.log(`   Expected to start with: eyJ`);
                hasErrors = true;
            } else {
                console.log(`✅ ${varName}: OK (${value.substring(0, 20)}...)`);
            }
        } else {
            console.log(`✅ ${varName}: OK`);
        }
    }
});

console.log('\n' + '='.repeat(50));

if (allPresent && !hasErrors) {
    console.log('✅ All environment variables are properly configured!');
    console.log('\nYou can now run: npm run dev');
    process.exit(0);
} else {
    console.log('❌ Environment variables configuration has issues!');
    console.log('\nPlease check the following:');
    console.log('1. Make sure .env.local file exists in the root directory');
    console.log('2. Copy .env.example to .env.local if you haven\'t');
    console.log('3. Fill in the correct values from your Supabase project');
    console.log('4. Get your credentials from: https://app.supabase.com/project/_/settings/api');
    console.log('\nFor deployment, make sure to set these variables in your hosting platform.');
    console.log('See DEPLOYMENT_GUIDE.md for detailed instructions.');
    process.exit(1);
}
