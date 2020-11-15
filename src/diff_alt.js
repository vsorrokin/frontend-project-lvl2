// /* eslint-disable no-restricted-syntax */
// import { promises as fs } from 'fs';
// import _ from 'lodash';

// const UNCHANGED = '';
// const REMOVED = '-';
// const ADDED = '+';

// const stringifyReport = (diffReport) => {
//   const lines = diffReport.map(({ action, key, value }) => {
//     const prefix = _.padStart(action, 4);
//     return `${prefix} ${key}: ${value}`;
//   });

//   return `{\n${lines.join('\n')}\n}`;
// };

// const setDiff = (flag, report, key, value) => {
//   switch (flag) {
//     case UNCHANGED:
//       report[key] = { action: flag, val: report[key] };
//       break;
//     default:
//       break;
//   }
// }

// export default async (file1, file2) => {
//   const [original, changed] = (await Promise.all([
//     fs.readFile(file1, 'utf-8'),
//     fs.readFile(file2, 'utf-8'),
//   ])).map((it) => JSON.parse(it));

//   const diffReport = {...original};

//   for (const [changedKey, changedValue] of Object.entries(changed)) {
//     if (_.has(original, changedKey)) {
//       const originalValue = original[changedKey];

//       if (originalValue !== changedValue) {
//         setDiff(CHANGED, diffReport, changedKey, changedValue);
//       } else {
//         setDiff(UNCHANGED, diffReport, changedKey);
//       }
//     } else {
//       setDiff(ADDED, diffReport, changedKey);
//     }
//   }

//   return stringifyReport(diffReport);
// };
