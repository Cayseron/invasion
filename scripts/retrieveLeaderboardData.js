const mongoose = require('mongoose');
const Account = require('../models/account');
const fs = require('fs');
const data = {
	seasonalLeaderboard: [],
	dailyLeaderboard: []
};

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:15726/secret-hitler-app`);

Account.find({ 'games.1': { $exists: true } })
	.cursor()
	.eachAsync(account => {
		if (account.account.previousDayElo > 1620) {
			data.seasonalLeaderboard.push({
				userName: account.username,
				elo: account.eloSeason
			});
		}
		account.previousDayElo = account.eloSeason;
		account.save();
	})
	.then(() => {
		Account.find({ lastCompletedGame: { $gte: new Date(Date.now() - 86400000) } })
			.cursor()
			.eachAsync(account => {
				data.dailyLeaderboard.push({
					userName: account.username,
					dailyEloDifference: account.eloSeason - account.previousDayElo
				});
			})
			.then(() => {
				data.dailyLeaderboard = data.dailyLeaderboard.sort((a, b) => b.dailyEloDifference - a.dailyEloDifference).slice(0, 20);
				data.seasonalLeaderboard = data.seasonalLeaderboard.sort((a, b) => b.elo - a.elo).slice(0, 20);
				fs.writeFile('/var/www/secret-hitler/public/leaderboardData.json', JSON.stringify(data), () => {
					mongoose.connection.close();
				});
			});
	});
