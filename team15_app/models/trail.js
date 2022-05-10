/* Student mongoose model */
const mongoose = require('mongoose')

const Trail = mongoose.model('Trail', {
	title: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	picture: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	strava: {
		type: String,
		required: true
	},
	users: {
		type: Array,
		required: true
	},
	times: {
		type: Array,
		required: true
	},
	ratings: {
		type: Array,
		required: true
	},
	date: {
		type: String,
		required: true
	}
})

module.exports = { Trail }
