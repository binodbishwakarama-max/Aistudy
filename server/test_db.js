require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Testing DB Connection...");
    try {
        // 1. Check if 'decks' table exists by selecting 1 row
        const { data: selectData, error: selectError } = await supabase
            .from('decks')
            .select('id')
            .limit(1);

        if (selectError) {
            log("SELECT Error (Table might be missing): " + JSON.stringify(selectError));
        } else {
            log("SELECT Success: Found " + selectData.length + " rows.");
        }

        // 2. Try INSERT with dummy data
        const { data: insertData, error: insertError } = await supabase
            .from('decks')
            .insert({
                user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
                title: 'Test Deck',
                description: 'Test Description',
                card_count: 0
            })
            .select();

        if (insertError) {
            log("INSERT Error: " + JSON.stringify(insertError));
        } else {
            log("INSERT Success: " + JSON.stringify(insertData));
            // Cleanup
            if (insertData && insertData[0]) {
                await supabase.from('decks').delete().eq('id', insertData[0].id);
                log("Cleanup Success");
            }
        }

    } catch (e) {
        log("Exception: " + e.message);
    }
}

function log(msg) {
    console.log(msg);
    // fs.appendFileSync('db_test_log.txt', msg + '\n'); 
}

test();
