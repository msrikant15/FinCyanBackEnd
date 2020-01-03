/**
 * @typedef {(code: number) => boolean} findCodeFn
 */

/**
 * @param {findCodeFn} findCodeFn
 */
async function generateCode(findCodeFn) {
  const code = Math.floor(Math.random() * 90000) + 10000;
  const isExist = await findCodeFn(code);

  if (isExist) return generateCode();
  return code;
}

export default generateCode;
