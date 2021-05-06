const getAllCities = async(db) => {
    const data =  await db.select().table('cities');
    return data;
}

module.exports = {
    getAllCities
}