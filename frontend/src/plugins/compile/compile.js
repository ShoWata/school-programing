import { postCompiler } from './post-compiler'

export function compileCode (code) {
  const KEYWORD = /input/
  const NEWLINE = /\n(?!$)/g

  function inputExists (code) {
    if (code.match(KEYWORD)) {
      return true
    } else {
      return false
    }
  }

  function lineBreak (res) {
    const texts = res.split(NEWLINE)
    return texts
  }

  async function retrieveInputTextAndCompile (code) {
    const codeLines = code.split(NEWLINE)

    var partOfCode = ''
    var dividedCodes = []
    codeLines.forEach(codeLine => {
      if (codeLine.match(KEYWORD)) {
        if (partOfCode) {
          dividedCodes.push(partOfCode)
          partOfCode = ''
        }
      }
      if (partOfCode) partOfCode += '\n'
      partOfCode += codeLine
    })
    if (partOfCode) {
      dividedCodes.push(partOfCode)
    }

    var terminalTexts = []
    for (var dividedCode of dividedCodes) {
      if (!dividedCode.match(KEYWORD)) {
        await postCompiler(dividedCode).then(res => {
          if (res) {
            terminalTexts = terminalTexts.concat(lineBreak(res))
          }
        })
      } else {
        const splitedCodes = dividedCode.split(/\s|\('|'\)|\("|"\)|\(|\)/g)
        const inputIndex = splitedCodes.findIndex(part => part.match(KEYWORD))
        const inputText = splitedCodes[inputIndex + 1]
        terminalTexts.push(inputText)
        break
      }
    }

    return { terminalTexts: terminalTexts, dividedCodes: dividedCodes, input: true }
  }

  return new Promise((resolve, reject) => {
    if (inputExists(code)) {
      resolve(retrieveInputTextAndCompile(code))
    } else {
      postCompiler(code).then(res => {
        const returnData = { terminalTexts: lineBreak(res), dividedCode: null, input: false }
        resolve(returnData)
      }).catch(err => {
        reject(err)
      })
    }
  })
}
