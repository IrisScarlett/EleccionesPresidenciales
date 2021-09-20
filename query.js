const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'mayoi1905',
    database: 'elecciones',
    port: 5002
});

const guardarCandidato = async (candidato) => {
    const values = Object.values(candidato);
    const consulta = {
        text: 'INSERT INTO candidatos (nombre, foto, color, votos) values ($1, $2, $3, 0)',
        values
    }
    
    const result = await pool.query(consulta)
    return result;
}

const getCandidatos = async () => {
    const result = await pool.query('SELECT * FROM candidatos');
    return result.rows
}

const registrarVotos = async (voto) => {
    const values = Object.values(voto);

    const registrarVotoHistorial = {
        text: 'INSERT INTO historial (estado, votos, ganador) values ($1, $2, $3)',
        values,
    };

    const registrarVotoCandidato = {
        text: 'UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2',
        values: [Number(values[1]), values[2]],
    };

    try {
        await pool.query('BEGIN');
        await pool.query(registrarVotoHistorial);
        await pool.query(registrarVotoCandidato);
        await pool.query('COMMIT');
        return true;
    } catch(e) {
        await pool.query('ROLLBACK');
        throw e;
    }
}

const getHistorial = async () => {
    const consulta = {
        text: 'SELECT * FROM historial',
        rowMode: 'array',
    }
    const result = await pool.query(consulta);
    return result.rows;
}
module.exports = { guardarCandidato, getCandidatos, registrarVotos, getHistorial }