const entries = [
  {
    en: "learn",
    zh: "学习",
    pinyin: "xue xi",
    meaning: "to gain knowledge or skill by study, practice, or experience",
    exampleEn: "I learn five new words every morning.",
    exampleZh: "我每天早上学习五个新单词。"
  },
  {
    en: "dictionary",
    zh: "词典",
    pinyin: "ci dian",
    meaning: "a reference tool for words and meanings",
    exampleEn: "This dictionary helps me compare English and Chinese.",
    exampleZh: "这本词典帮助我比较英语和中文。"
  },
  {
    en: "friend",
    zh: "朋友",
    pinyin: "peng you",
    meaning: "a person you know well and like",
    exampleEn: "My friend studies Chinese with me.",
    exampleZh: "我的朋友和我一起学中文。"
  },
  {
    en: "travel",
    zh: "旅行",
    pinyin: "lv xing",
    meaning: "to go from one place to another",
    exampleEn: "We travel to Shanghai in July.",
    exampleZh: "我们七月去上海旅行。"
  },
  {
    en: "food",
    zh: "食物",
    pinyin: "shi wu",
    meaning: "things people eat",
    exampleEn: "Chinese food has many regional styles.",
    exampleZh: "中国食物有很多地方风味。"
  },
  {
    en: "water",
    zh: "水",
    pinyin: "shui",
    meaning: "a clear liquid that people drink",
    exampleEn: "Please drink more water.",
    exampleZh: "请多喝水。"
  },
  {
    en: "book",
    zh: "书",
    pinyin: "shu",
    meaning: "printed or digital pages for reading",
    exampleEn: "This book is easy to read.",
    exampleZh: "这本书很容易读。"
  },
  {
    en: "morning",
    zh: "早上",
    pinyin: "zao shang",
    meaning: "the early part of the day",
    exampleEn: "I review vocabulary in the morning.",
    exampleZh: "我早上复习词汇。"
  },
  {
    en: "work",
    zh: "工作",
    pinyin: "gong zuo",
    meaning: "a job or an activity that requires effort",
    exampleEn: "She goes to work by subway.",
    exampleZh: "她坐地铁去工作。"
  },
  {
    en: "home",
    zh: "家",
    pinyin: "jia",
    meaning: "the place where someone lives",
    exampleEn: "He reads at home after dinner.",
    exampleZh: "他晚饭后在家读书。"
  },
  {
    en: "weather",
    zh: "天气",
    pinyin: "tian qi",
    meaning: "the condition of the air outside",
    exampleEn: "The weather is warm today.",
    exampleZh: "今天天气很暖和。"
  },
  {
    en: "question",
    zh: "问题",
    pinyin: "wen ti",
    meaning: "something asked or a problem to solve",
    exampleEn: "Ask a question when you need help.",
    exampleZh: "需要帮助时就问问题。"
  }
];

const searchInput = document.querySelector("#searchInput");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#resultCount");
const modeLabel = document.querySelector("#modeLabel");
const modeEn = document.querySelector("#modeEn");
const modeZh = document.querySelector("#modeZh");
const swapButton = document.querySelector("#swapButton");
const clearButton = document.querySelector("#clearButton");
const favorites = document.querySelector("#favorites");

let mode = "en";
let savedWords = JSON.parse(localStorage.getItem("dict-learn2-saved") || "[]");

function normalize(value) {
  return value.trim().toLowerCase();
}

function setMode(nextMode) {
  mode = nextMode;
  modeEn.classList.toggle("active", mode === "en");
  modeZh.classList.toggle("active", mode === "zh");
  modeEn.setAttribute("aria-selected", String(mode === "en"));
  modeZh.setAttribute("aria-selected", String(mode === "zh"));
  searchInput.placeholder = mode === "en" ? "Type a word, e.g. learn" : "输入中文，例如 学习";
  modeLabel.textContent = mode === "en" ? "English to Chinese" : "Chinese to English";
  render();
}

function getMatches() {
  const query = normalize(searchInput.value);
  if (!query) {
    return entries;
  }

  return entries.filter((entry) => {
    if (mode === "en") {
      return entry.en.includes(query) || entry.meaning.toLowerCase().includes(query);
    }

    return entry.zh.includes(query) || normalize(entry.pinyin).includes(query);
  });
}

function isSaved(entry) {
  return savedWords.includes(entry.en);
}

function toggleSave(word) {
  savedWords = savedWords.includes(word)
    ? savedWords.filter((savedWord) => savedWord !== word)
    : [...savedWords, word];
  localStorage.setItem("dict-learn2-saved", JSON.stringify(savedWords));
  render();
}

function renderResults(matches) {
  if (matches.length === 0) {
    results.innerHTML = '<p class="no-results">No matches found.</p>';
    return;
  }

  results.innerHTML = matches
    .map((entry) => {
      const primary = mode === "en" ? entry.en : entry.zh;
      const secondary = mode === "en" ? entry.zh : entry.en;
      const exampleMain = mode === "en" ? entry.exampleEn : entry.exampleZh;
      const exampleSub = mode === "en" ? entry.exampleZh : entry.exampleEn;
      const savedClass = isSaved(entry) ? " saved" : "";

      return `
        <article class="result-card">
          <div>
            <div class="word">
              <strong>${primary}</strong>
              <span>${secondary}</span>
              <span>${entry.pinyin}</span>
            </div>
            <p class="meaning">${entry.meaning}</p>
            <p class="example">${exampleMain}<small>${exampleSub}</small></p>
          </div>
          <button class="save-button${savedClass}" type="button" data-word="${entry.en}" title="Save word" aria-label="Save ${entry.en}">★</button>
        </article>
      `;
    })
    .join("");
}

function renderFavorites() {
  const savedEntries = entries.filter((entry) => savedWords.includes(entry.en));
  if (savedEntries.length === 0) {
    favorites.className = "favorites empty";
    favorites.textContent = "No saved words yet.";
    return;
  }

  favorites.className = "favorites";
  favorites.innerHTML = savedEntries
    .map((entry) => `
      <div class="favorite-item">
        <strong>${entry.en}</strong>
        <span>${entry.zh} · ${entry.pinyin}</span>
      </div>
    `)
    .join("");
}

function render() {
  const matches = getMatches();
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? "match" : "matches"}`;
  renderResults(matches);
  renderFavorites();
}

modeEn.addEventListener("click", () => setMode("en"));
modeZh.addEventListener("click", () => setMode("zh"));
swapButton.addEventListener("click", () => setMode(mode === "en" ? "zh" : "en"));
searchInput.addEventListener("input", render);
clearButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  render();
});

results.addEventListener("click", (event) => {
  const button = event.target.closest(".save-button");
  if (button) {
    toggleSave(button.dataset.word);
  }
});

render();
