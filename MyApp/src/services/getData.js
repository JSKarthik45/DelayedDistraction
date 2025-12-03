import { supabase } from '../services/supabase';

async function getData(tableName, limit = 10, afterId = null) {
    let query = supabase.from(tableName).select('*');
    if (afterId != null) {
        query = query.gt('id', afterId);
    }
    // Ensure deterministic order
    query = query.order('id', { ascending: true }).limit(limit);
    return await query;
}


export async function getPuzzlesData(tableName, limit = 10, afterId = null) {
        const [res] = await Promise.all([
                getData(tableName, limit, afterId),
        ]);

    const { data: data, error: error } = res || {};

    const mapRows = (rows) => (rows || []).map((row) => ({
        id: (typeof row.id === 'number' ? row.id : null),
        key: String(row.id ?? row.key ?? Math.random()),
        fen: row.fen,
        turnText: row.turnText || row.turn || 'White to play',
        text: row.text || 'Can you solve this puzzle?',
        correctMove: row.correctMove ?? null,
    }));

    return error ? [] : mapRows(data);
}