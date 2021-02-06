export function replaceInputCode (dividedCodes, inputText, value) {
  const alternative = '\'' + value + '\''
  const replacePart = 'input(\'' + inputText + '\')'
  const inputCodeIndex = dividedCodes.findIndex(code => code.match(inputText) && code.match(/input/))

  var replacedCodes = []
  var index = 0
  for (var code of dividedCodes) {
    if (index === inputCodeIndex) {
      const inputAltCode = 'print(\'' + inputText + value + '\')'
      replacedCodes.push(inputAltCode + '\n')

      const replacedCode = code.replace(replacePart, alternative)
      replacedCodes.push(replacedCode + '\n')
    } else {
      replacedCodes.push(code + '\n')
    }
    index++
  }

  return replacedCodes.join('')
}
