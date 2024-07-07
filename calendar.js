document.addEventListener('DOMContentLoaded', () => {
    const daysContainer = document.querySelector('.days-container');
    const presaButton = document.getElementById('presaButton');
    const premiButton = document.getElementById('premiButton');
    const premiSection = document.getElementById('premi');
    const calendarioSection = document.getElementById('calendario');
    const tornaButton = document.getElementById('tornaButton');
    const puntiCounter = document.getElementById('punti-counter');
    const resetButton = document.getElementById('resetButton');

    const numDays = 31;
    let takenDays = JSON.parse(localStorage.getItem('takenDays')) || new Array(numDays).fill(false);
    let activeDay = null;

    // Crea i pulsanti per i giorni e carica lo stato iniziale
    for (let i = 1; i <= numDays; i++) {
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');

      const dayButton = document.createElement('div');
      dayButton.classList.add('day-button');
      dayButton.textContent = i;
      
      // Carica lo stato iniziale dal localStorage
      if (takenDays[i - 1]) {
        dayButton.classList.add('taken');
      }
      
      swiperSlide.appendChild(dayButton);
      daysContainer.appendChild(swiperSlide);
    }

    // Inizializza Swiper.js
    const swiper = new Swiper('.swiper', {
      slidesPerView: 3,
      spaceBetween: 15,
      freeMode: false,
      centeredSlides: true,
      initialSlide: new Date().getDate() - 1,
      on: {
        slideChangeTransitionEnd: function () {
          this.slideTo(this.activeIndex, 0);
        }
      }
    });

    // Funzione per cambiare lo stato di un giorno
    function toggleDay(dayIndex) {
      const slideIndex = dayIndex - 1;
      takenDays[slideIndex] = !takenDays[slideIndex];
      updateDayButton(dayIndex);
      localStorage.setItem('takenDays', JSON.stringify(takenDays));

      if (takenDays[slideIndex] && slideIndex === swiper.activeIndex) {
        if (activeDay !== null) {
          daysContainer.children[activeDay - 1].firstChild.classList.remove('active');
        }
        activeDay = dayIndex;
        daysContainer.children[activeDay - 1].firstChild.classList.add('active');
      } else {
        if (activeDay !== null) {
          daysContainer.children[activeDay - 1].firstChild.classList.remove('active');
        }
        activeDay = null;
      }

      sbloccaPremi(); // Aggiorna i premi quando si cambia lo stato di un giorno
    }

    // Funzione per aggiornare l'aspetto del pulsante del giorno
    function updateDayButton(dayIndex) {
      const dayButton = daysContainer.children[dayIndex - 1].firstChild;
      dayButton.classList.toggle('taken', takenDays[dayIndex - 1]);
    }

    // Funzione per resettare tutti i giorni
    resetButton.addEventListener('click', () => {
      takenDays.fill(false);
      activeDay = null;
      localStorage.setItem('takenDays', JSON.stringify(takenDays));
      for (let i = 0; i < daysContainer.children.length; i++) {
        const dayButton = daysContainer.children[i].firstChild;
        dayButton.classList.remove('taken', 'active'); // Rimuovi sia taken che active
      }
      // Aggiorna il contatore dei punti nella sezione "Premi" (se visibile)
      const puntiCounter = document.getElementById('punti-counter');
      if (puntiCounter) {
        puntiCounter.textContent = 0;
        sbloccaPremi(); 
      }
    });

    // Evita la selezione accidentale dei giorni durante lo scorrimento
    daysContainer.addEventListener('mousedown', (event) => {
        event.preventDefault();
    });

    // Gestione del popup "Premi"
    premiButton.addEventListener('click', () => {
        calendarioSection.style.display = 'none';
        premiSection.style.display = 'block';
        sbloccaPremi(); // Chiamata a sbloccaPremi quando si apre la sezione premi
    });

    tornaButton.addEventListener('click', () => {
        premiSection.style.display = 'none';
        calendarioSection.style.display = 'block';
    });

    function sbloccaPremi() {
        const premiContainer = document.querySelector('.premi-container');
        const puntiCounter = document.getElementById('punti-counter');
      
        const premi = [
          { nome: "Premio 1", immagine: "premio1.jpg", puntiRichiesti: 10, paginaHtml: "premio1.html" },
          { nome: "Premio 2", immagine: "premio2.jpg", puntiRichiesti: 20, paginaHtml: "premio2.html" },
          { nome: "Premio 3", immagine: "premio3.jpg", puntiRichiesti: 30, paginaHtml: "30.html" },
          // ... aggiungi altri premi qui
        ];
      
        let premiRiscattati = JSON.parse(localStorage.getItem('premiRiscattati')) || {};
      
        const giorniPresi = takenDays.filter(Boolean).length;
        puntiCounter.textContent = giorniPresi;
      
        premiContainer.innerHTML = '';
      
        premi.forEach((premio) => {
          const premioDiv = document.createElement('div');
          premioDiv.classList.add('premio');
      
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('img-container');
          if (premiRiscattati[premio.nome]) {
            imgContainer.classList.add('riscattato');
          } else if (giorniPresi >= premio.puntiRichiesti) {
            imgContainer.classList.add('riscattabile');
          } else {
            imgContainer.classList.add('locked');
          }
      
          const img = document.createElement('img');
          img.src = premio.immagine;
          img.alt = premio.nome;
          imgContainer.appendChild(img);
      
          const lockIcon = document.createElement('div');
          lockIcon.classList.add('lock-icon');
          lockIcon.innerHTML = '&#128274;'; // Emoji lucchetto
          if (!premiRiscattati[premio.nome]) {
            imgContainer.appendChild(lockIcon);
          }
      
          const infoContainer = document.createElement('div');
          infoContainer.classList.add('info-container');
      
          const puntiText = document.createElement('div');
          puntiText.classList.add('punti-text');
          puntiText.textContent = `${premio.puntiRichiesti} punti`;
          infoContainer.appendChild(puntiText);
      
          // Creazione del pulsante "Riscatta" o "Apri"
          const button = document.createElement('button');
          button.classList.add('riscatta-button');
          if (premiRiscattati[premio.nome]) {
            button.textContent = 'Apri';
            button.addEventListener('click', () => {
              window.location.href = premio.paginaHtml;
            });
          } else {
            button.textContent = 'Riscatta';
            button.disabled = giorniPresi < premio.puntiRichiesti;
            button.addEventListener('click', () => {
              if (giorniPresi >= premio.puntiRichiesti) {
                takenDays = takenDays.map((day) => day && Math.random() < 0.8);
                localStorage.setItem('takenDays', JSON.stringify(takenDays));
                premiRiscattati[premio.nome] = true;
                localStorage.setItem('premiRiscattati', JSON.stringify(premiRiscattati));
                sbloccaPremi(); // Aggiorna i premi dopo il riscatto
              }
            });
          }
          infoContainer.appendChild(button);
      
          premioDiv.appendChild(imgContainer);
          premioDiv.appendChild(infoContainer);
          premiContainer.appendChild(premioDiv);
        });
      }
      
      
 // Gestisci il clic sul pulsante "Presa" (corretto)
 presaButton.addEventListener('click', () => {
    const centerSlideIndex = swiper.activeIndex;
    toggleDay(centerSlideIndex + 1); // Attiva/disattiva il giorno centrale
  });
// Chiama sbloccaPremi inizialmente per caricare i premi al caricamento della pagina
sbloccaPremi(); 
});
