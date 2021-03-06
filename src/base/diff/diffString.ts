//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

// tslint:disable cyclomatic-complexity
// tslint:disable max-file-line-count

/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Modified for objects and TypeScript by Dimitriy Borshchov "grimstal" grimstal@bigmir.net
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

// Contains indexes of item's positions
interface DiffParsingItem {
	rows : number[];
}

// Contains info about simple part of string word and every it's position
interface DiffParsingObject {
	[name : string] : DiffParsingItem;
}

// Result of pre-parsing the string
interface DiffResultObject {
	o : any[];  // Array of objects from an old string
	n : any[];  // Array of objects from a new string
}

// Object to show every single part of string after diff check
export interface DiffBit {
	count : number;  // Amount of items in string part
	added? : boolean;  // Is string added
	removed? : boolean;  // Is string removed
	value : string;  // String part
}

/*
 * Create an array of DiffBits from object or a string with result of diff operation
 */
export function diffString(orgStr : string, newStr : string) : Array<DiffBit> {
	// Updates the previous string part adding to it value and count of current item
	function updatePrevious(value : string) {
		const lastIndex : number = result.length - 1;
		const lastItem : DiffBit = result[lastIndex];
		const replaceItem : DiffBit = Object.assign({}, lastItem, {
			count: lastItem.count + 2,
			value: lastItem.value + value,
		});

		result.splice(lastIndex, 1, replaceItem);
	}

	// Adding a new string part with added/deleted flags
	function addOptItem(value: string, isAdding: boolean) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffBit = result[lastIndex];
		const optItem: DiffBit = {
			count: 2,
			added: isAdding,
			removed: !isAdding,
			value: value,
		};

		if (lastItem && (isAdding ?
				(lastItem.added && !lastItem.removed) :
				(!lastItem.added && lastItem.removed))) {
			updatePrevious(value);
		} else {
			result.push(optItem);
		}
	}

	// Adding a new string part for item that has not been changed
	function addItem(value: string) {
		const lastIndex: number = result.length - 1;
		const lastItem: DiffBit = result[lastIndex];
		if (lastItem && !lastItem.added && !lastItem.removed) {
			updatePrevious(value);
		} else {
			result.push({count: 2, value: value});
		}
	}

	const result : DiffBit[] = [];
	const lastSymbol : string = '';

	const o = orgStr.replace(/\s+$/, '');
	const n = newStr.replace(/\s+$/, '');

	// Pre-parse the strings
	const out : DiffResultObject = diffPreParse(!o ? [] : o.split(/\s+/), !n ? [] : n.split(/\s+/));

	// Set an array of space characters to add
	let oSpace : string[] = o.match(/\s+/g);

	if (!oSpace) {
		oSpace = [lastSymbol];
	}
	else {
		oSpace.push(lastSymbol);
	}

	let nSpace : string[] = n.match(/\s+/g);

	if (!nSpace) {
		nSpace = [lastSymbol];
	}
	else {
		nSpace.push(lastSymbol);
	}

	// If no new string then set all as deleted
	if (out.n.length === 0) {
		for (let i = 0; i < out.o.length; i++) {
			addOptItem(out.o[i] + oSpace[i], false);
		}
	} else {
		if (!out.n[0].text) {
			for (let m = 0; m < out.o.length && !out.o[m].text; m++) {
				addOptItem(out.o[m] + oSpace[m], false);
			}
		}

		for (let i = 0; i < out.n.length; i++) {
			if (!out.n[i].text) {
				addOptItem(out.n[i] + nSpace[i], true);
			} else {
				const preArr = [];  // String parts to pass to the end as deleted

				for (let m = out.n[i].row + 1; m < out.o.length && !out.o[m].text; m++) {
					preArr.push(out.o[m] + oSpace[m]);
				}
				addItem(out.n[i].text + nSpace[i]);
				preArr.forEach(function (item) {
					addOptItem(item, false);
				});
			}
		}
	}

	return result;
}

/**
 * Preparse strings to find and mark parts which are same and which differ
 */
function diffPreParse(o : string[], n : string[]) : DiffResultObject {
	const ns : DiffParsingObject = {};  // Info for new string
	const os : DiffParsingObject = {};  // Info for old string
	const nn : any[] = Object.assign([], n);  // Object to change while parsing new string
	const no : any[] = Object.assign([], o);  // Object to change while parsing old string

	// Pick info about every simple part of new string and it's positions
	for (let i = 0; i < nn.length; i++) {
		if (!ns[nn[i]]) {
			ns[nn[i]] = {rows: []};
		}
		ns[nn[i]].rows.push(i);
	}

	// Pick info about every simple part of old string and it's positions
	for (let i = 0; i < no.length; i++) {
		if (!os[no[i]]) {
			os[no[i]] = {rows: []};
		}
		os[no[i]].rows.push(i);
	}

	// Marking parts that are the same
	for (const i in ns) {
		if (ns[i].rows.length === 1 && typeof(os[i]) !== 'undefined' &&
			os[i].rows.length === 1) {
			nn[ns[i].rows[0]] = {text: nn[ns[i].rows[0]], row: os[i].rows[0]};
			no[os[i].rows[0]] = {text: no[os[i].rows[0]], row: ns[i].rows[0]};
		}
	}

	// Looking for parts with differences
	for (let i = 0; i < nn.length - 1; i++) {
		if (nn[i].text && !nn[i + 1].text && nn[i].row + 1 < no.length &&
			!no[nn[i].row + 1].text && nn[i + 1] === no[nn[i].row + 1]) {
			nn[i + 1] = {text: nn[i + 1], row: nn[i].row + 1};
			no[nn[i].row + 1] = {text: no[nn[i].row + 1], row: i + 1};
		}
	}

	// Still looking for parts with differences
	for (let i = nn.length - 1; i > 0; i--) {
		if (nn[i].text && !nn[i - 1].text && nn[i].row > 0 &&
			!no[nn[i].row - 1].text && nn[i - 1] === no[nn[i].row - 1]) {
			nn[i - 1] = {text: nn[i - 1], row: nn[i].row - 1};
			no[nn[i].row - 1] = {text: no[nn[i].row - 1], row: i - 1};
		}
	}

	return {
		o: no,
		n: nn,
	};
}
