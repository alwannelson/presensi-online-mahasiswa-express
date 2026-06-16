const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const today = new Date().getDay()
const currentDay = days[today]

module.exports = currentDay