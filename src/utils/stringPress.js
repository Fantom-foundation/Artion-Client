/**
 * LZW COMPRESSION / DECOMPRESSION
 */

export const compress = string => {
  if (!string) return;

  const dict = {};
  const data = string.split('');
  const output = [];
  let currChar;
  let phrase = data[0];
  let code = 256;

  for (let i = 1; i < data.length; i++) {
    currChar = data[i];

    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      output.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase = currChar;
    }
  }

  output.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));

  for (let i = 0; i < output.length; i++) {
    output[i] = String.fromCharCode(output[i]);
  }
  return output.join('');
};

export const decompress = string => {
  if (!string) return;

  const dict = {};
  const data = string.split('');
  let currChar = data[0];
  let oldPhrase = currChar;
  let output = [currChar];
  let code = 256;
  let phrase;

  for (let i = 1; i < data.length; i++) {
    let currCode = data[i].charCodeAt(0);

    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
    }

    output.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  }

  return output.join('');
};
