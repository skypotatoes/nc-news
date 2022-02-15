const db = require('./db/connection')

exports.fetchTopics = ()=>{
    return db.query(`
    SELECT slug, description FROM topics
    `).then(results=>{
        return results.rows
    })
}

exports.changeVotes = (newVotes, id)=>{
    console.log("You are here inside changeVotes")
    db.query('SELECT votes FROM articles WHERE article_id=$1',[id])
    .then(result => result.rows[0].votes)
    .then(currentVotes=> currentVotes+newVotes)
    .then(totalVotes=>{
        console.log(totalVotes)
        //goes wrong on the next line>> "Error: Cannot use a pool after calling end on the pool"
        return db.query(`
        UPDATE articles 
        SET votes = ${totalVotes}
        WHERE article_id = $1
        RETURNING *;
        `,[id])//database query to update votes for the relevant article
    }).catch(err => console.log(err))
    
    
}