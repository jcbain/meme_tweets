const getYesterday = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1)
    return date;
}

const formatDate = (date) => {
    return `${date.getUTCFullYear().toString().padStart(2, 0)}-${(date.getUTCMonth() + 1).toString().padStart(2, 0)}-${(date.getUTCDay() + 1).toString().padStart(2, 0)}T06:00:00Z`
}

module.exports = {
    getYesterday, 
    formatDate
}