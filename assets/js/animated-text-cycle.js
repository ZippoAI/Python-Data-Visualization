const AnimatedTextCycle = (function () {
  function createMeasurement(words, className) {
    const measure = document.createElement("div")
    measure.style.position = "absolute"
    measure.style.visibility = "hidden"
    measure.style.whiteSpace = "nowrap"
    measure.style.pointerEvents = "none"

    const spans = words.map(word => {
      const span = document.createElement("span")
      span.textContent = word
      span.className = className
      measure.appendChild(span)
      return span
    })

    document.body.appendChild(measure)
    return { measure, spans }
  }

  function init({ elementId, words, interval = 5000 }) {
    const host = document.getElementById(elementId)
    if (!host || !words?.length) return

    const container = document.createElement("span")
    container.className = "animated-text-container"
    host.appendChild(container)

    const { measure, spans } = createMeasurement(words, "animated-text-word")

    let index = 0
    let currentWordEl = null

    function setWidth(i) {
      container.style.width =
        spans[i].getBoundingClientRect().width + "px"
    }

    function createWord(word) {
      const el = document.createElement("span")
      el.textContent = word
      el.className = "animated-text-word word-enter"
      return el
    }

    function animate() {
      const nextWord = createWord(words[index])
      container.appendChild(nextWord)

      requestAnimationFrame(() => {
        nextWord.classList.add("word-enter-active")
      })

      if (currentWordEl) {
        currentWordEl.classList.add("word-exit-active")
        setTimeout(() => {
          currentWordEl.remove()
        }, 300)
      }

      currentWordEl = nextWord
      setWidth(index)
      index = (index + 1) % words.length
    }

    animate()
    setInterval(animate, interval)

    window.addEventListener("beforeunload", () => {
      measure.remove()
    })
  }

  return { init }
})()
