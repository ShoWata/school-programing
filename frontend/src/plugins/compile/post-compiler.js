import axios from 'axios'

export function postCompiler (code) {
  return new Promise((resolve, reject) => {
    if (code) {
      axios.post(
        'https://wandbox.org/api/compile.json',
        { code: code, compiler: 'cpython-3.7.5' },
        { headers: { 'Content-type': 'application/json' } }
      ).then(res => {
        if (res.data.program_message) {
          resolve(res.data.program_message)
        } else {
          resolve('実行結果がありません')
        }
      })
    } else {
      reject(new Error('コードを書いてください！'))
    }
  })
}
