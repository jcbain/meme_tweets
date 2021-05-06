const getAllCities = async(db) => {
    const data =  await db.select().table('cities');
    return data;
}

const getCityByName = async(db, cityName) => {
    const data = await db('cities').where('city_name', cityName);
    return data;
}

module.exports = {
    getAllCities,
    getCityByName
}