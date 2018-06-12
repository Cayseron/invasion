const cn = require('classnames');

const MODERATORS = (module.exports.MODERATORS = [
	'Tubadevil',
	'Faaiz1999',
	'littlebird',
	'Hexicube',
	'RavenCaps',
	'jdudle3',
	'Number5',
	'Ophxlia',
	'cayseron',
	'neffni',
	'benjamin172'
]);

module.exports.TRIALMODS = ['mara717', 'dia', 'Yawner'];

const EDITORS = (module.exports.EDITORS = ['Max', 'cbell', 'Invidia', 'TheJustStopO']);
const ADMINS = (module.exports.ADMINS = ['coz', 'Stine']);
const CONTRIBUTORS = (module.exports.CONTRIBUTORS = [
	'straightleft',
	'Idrissa',
	'banc',
	'HREmperor',
	'Royal2000H',
	'OuchYouHitMe',
	'Auengun',
	'Skyrra',
	'jbasrai',
	'sethe',
	'bot',
	'veggiemanz',
	'DFinn',
	'conundrum',
	'JerMej1s',
	'Invidia',
	'Wi1son',
	'LordVader',
	'voldemort',
	'goonbee'
]);

const CURRENTSEASONNUMBER = 2;

module.exports.CURRENTSEASONNUMBER = CURRENTSEASONNUMBER;

/**
 * @param {object} user - user from userlist.
 * @param {boolean} isSeasonal - whether or not to display seasonal colors.
 * @param {string} defaultClass - the default class
 * @param {boolean} eloDisabled - true if elo is off
 * @return {string} list of classes for colors.
 */
module.exports.PLAYERCOLORS = (user, isSeasonal, defaultClass, eloDisabled) => {
	if (MODERATORS.includes(user.userName) || ADMINS.includes(user.userName) || EDITORS.includes(user.userName) || CONTRIBUTORS.includes(user.userName)) {
		return cn(defaultClass, {
			admin: ADMINS.includes(user.userName),
			moderatorcolor: MODERATORS.includes(user.userName),
			editorcolor: EDITORS.includes(user.userName),
			contributer: CONTRIBUTORS.includes(user.userName),
			cbell: user.userName === 'cbell',
			max: user.userName === 'Max',
			dfinn: user.userName === 'DFinn',
			faaiz: user.userName === 'Faaiz1999',
			invidia: user.userName === 'Invidia',
			thejuststopo: user.userName === 'TheJustStopO'
		});
	} else {
		const w = isSeasonal ? user[`winsSeason${CURRENTSEASONNUMBER}`] : user.wins;
		const l = isSeasonal ? user[`lossesSeason${CURRENTSEASONNUMBER}`] : user.losses;
		const elo = isSeasonal ? user.eloSeason : user.eloOverall;
		let grade;
		if (elo < 1500) {
			grade = 0;
		} else if (elo > 2000) {
			grade = 500 / 5;
		} else {
			grade = (elo - 1500) / 5;
		}
		const gradeObj = {};
		gradeObj['elo' + grade.toFixed(0)] = true;

		return w + l >= 50
			? eloDisabled
				? cn(defaultClass, {
						experienced1: w + l > 49,
						experienced2: w + l > 99,
						experienced3: w + l > 199,
						experienced4: w + l > 299,
						experienced5: w + l > 499,
						onfire1: w / (w + l) > 0.52,
						onfire2: w / (w + l) > 0.54,
						onfire3: w / (w + l) > 0.56,
						onfire4: w / (w + l) > 0.58,
						onfire5: w / (w + l) > 0.6,
						onfire6: w / (w + l) > 0.62,
						onfire7: w / (w + l) > 0.64,
						onfire8: w / (w + l) > 0.66,
						onfire9: w / (w + l) > 0.68,
						onfire10: w / (w + l) > 0.7
				  })
				: cn(defaultClass, gradeObj)
			: defaultClass;
	}
};