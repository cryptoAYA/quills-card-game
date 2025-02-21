// Kullanacağımız resimlerin isimleri
const images = [
  "resim1.jpeg",
  "resim2.jpeg",
  "resim3.jpeg",
  "resim4.jpeg",
  "resim5.jpeg",
  "resim6.jpeg",
  "resim7.jpeg",
];

// DOM elemanları
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const winModal = document.getElementById("winModal");

// Kartları ve oyun durumunu takip eden değişkenler
let cardArray = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false; // İki kart açıkken tıklamaları engellemek için
let matchedPairs = 0;  // Eşleşen çift sayısı

// Oyunu başlatan fonksiyon
function initGame() {
  // Başlangıç değerlerini sıfırla
  gameContainer.innerHTML = "";
  matchedPairs = 0;
  scoreDisplay.textContent = matchedPairs;
  
  // Modal kapat (olası eski oyundan kalmışsa)
  winModal.style.display = "none";

  // Kartları oluştur (her resim 2 kere olacak)
  cardArray = [...images, ...images]; // Toplam 14 kart
  shuffle(cardArray);

  // HTML'e kartları ekle
  cardArray.forEach((imgName) => {
    // Kart dış kabuğu
    const card = document.createElement("div");
    card.classList.add("card");

    // Kart içi (ön ve arka yüz)
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    // Arka yüz (back.png)
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    const backImg = document.createElement("img");
    backImg.src = "back.jpg"; // Arkadaki resim
    cardBack.appendChild(backImg);

    // Ön yüz (resimX.png)
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    const frontImg = document.createElement("img");
    frontImg.src = imgName;
    cardFront.appendChild(frontImg);

    // cardInner içine ön ve arka yüzü ekle
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);

    // card içine cardInner'ı ekle
    card.appendChild(cardInner);

    // Tıklama olayı
    card.addEventListener("click", () => flipCard(card));

    // gameContainer'a ekle
    gameContainer.appendChild(card);
  });
}

// Karıştırma fonksiyonu (Fisher-Yates Shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Kart çevirme fonksiyonu
function flipCard(card) {
  // Eğer zaten iki kart açık veya bu kart zaten açık ise tıklama
  if (lockBoard || card.classList.contains("flipped")) return;

  // Kartı çevir
  card.classList.add("flipped");

  // İlk kart boşsa ilk kartı ayarla, doluysa ikinci kartı ayarla
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true; // 2. kart açıldıktan sonra diğer tıklamaları beklet

    // Eşleşme kontrolü
    checkForMatch();
  }
}

// Eşleşme kontrol fonksiyonu
function checkForMatch() {
  // Kartların ön yüz resimlerini al
  const firstImg = firstCard.querySelector(".card-front img").src;
  const secondImg = secondCard.querySelector(".card-front img").src;

  if (firstImg === secondImg) {
    // Eşleşti
    disableCards();
    matchedPairs++;
    scoreDisplay.textContent = matchedPairs;

    // 7 eşleşme olursa oyun biter
    if (matchedPairs === 7) {
      setTimeout(() => {
        showWinModal();
      }, 500);
    }
  } else {
    // Eşleşmezse kartları geri çevir
    unflipCards();
  }
}

// Eşleşince kartları devredışı bırak (açık kalsın)
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// Eşleşmeyen kartları kapatma
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Board ve değişkenleri resetleme
function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Kazanınca modalı gösteren fonksiyon
function showWinModal() {
  winModal.style.display = "block";
}

// "Yeniden Başlat" butonu
restartBtn.addEventListener("click", () => {
  initGame();
});

// Sayfa yüklendiğinde başlat
window.addEventListener("DOMContentLoaded", () => {
  initGame();
});
