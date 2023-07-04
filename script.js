const RANDOM_SENTENCE_URL_API = 'https://api.quotable.io/random'
const typeDisplay = document.getElementById('typeDisplay')
const typeInput = document.getElementById('typeInput')
const timer = document.getElementById('timer')

const typeSound = new Audio('./audio/typing-sound.mp3')
const wrongSound = new Audio('./audio/wrong.mp3')
const correctSound = new Audio('./audio/correct.mp3')

/* inputテキスト入力が合っているかどうかを判定する */
typeInput.addEventListener('input', () => {
  typeSound.play()
  typeSound.currentTime = 0

  const sentenceArray = typeDisplay.querySelectorAll('span')
  const arrayValue = typeInput.value.split('')

  let correct = true

  sentenceArray.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')

      correct = false
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.add('incorrect')
      characterSpan.classList.remove('correct')

      wrongSound.volume = 0.3
      wrongSound.play()
      wrongSound.currentTime = 0

      correct = false
    }
  })

  if (correct == true) {
    correctSound.play()
    correctSound.currentTime = 0

    RenderNextSentence()
  }
})

/* 非同期でランダムな文章を取得する */
const GetRandomSentence = async () => {
  const response = await fetch(RANDOM_SENTENCE_URL_API)
  const data = await response.json()
  return data.content
}

/* ランダムな文章を取得して表示する */
const RenderNextSentence = async () => {
  const sentence = await GetRandomSentence()
  // console.log(sentence)
  typeDisplay.innerText = ''

  /* 文章を一文字ずつ分解して、spanタグを生成する */
  let oneText = sentence.split('')
  oneText.forEach((character) => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    // console.log(characterSpan)
    typeDisplay.appendChild(characterSpan)
    // characterSpan.classList.add('correct')
  })

  /* テキストボックスの中身を消す */
  typeInput.value = ''

  StartTimer()
}

let startTime
let originTime = 60
const StartTimer = () => {
  timer.innerText = originTime
  startTime = new Date()

  setInterval(() => {
    timer.innerText = originTime - getTimerTime()
    if (timer.innerText <= 0) TimeUp()
  }, 1000)

  const getTimerTime = () => {
    return Math.floor((new Date() - startTime) / 1000)
  }

  const TimeUp = () => {
    wrongSound.volume = 0.3
    wrongSound.play()
    wrongSound.currentTime = 0

    RenderNextSentence()
  }
}

RenderNextSentence()
