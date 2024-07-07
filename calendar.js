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
        sbloccaPremi();
    });

    tornaButton.addEventListener('click', () => {
        premiSection.style.display = 'none';
        calendarioSection.style.display = 'block';
    });

    // Funzione per sbloccare le immagini (premi.js)
    function sbloccaPremi() {
      const premiContainer = document.querySelector('.premi-container');
      const puntiCounter = document.getElementById('punti-counter');
  
      // Definisci i premi (puoi personalizzarli)
      const premi = [
        { nome: "Premio 1", immagine: "premio.jpg", puntiRichiesti: 10 },
        { nome: "Premio 2", immagine: "immagine2.jpg", puntiRichiesti: 20 },
        { nome: "Premio 3", immagine: "immagine3.jpg", puntiRichiesti: 30 },
        // ... aggiungi altri premi qui
      ];
  
      const giorniPresi = takenDays.filter(Boolean).length;
      puntiCounter.textContent = giorniPresi;
  
      premiContainer.innerHTML = ''; // Pulisci il contenitore dei premi
  
      premi.forEach((premio) => {
        const premioDiv = document.createElement('div');
        premioDiv.classList.add('premio');
  
        const img = document.createElement('img');
        img.src = premio.immagine;
        img.alt = premio.nome;
        premioDiv.appendChild(img);
  
        const lockIcon = document.createElement('div');
        lockIcon.classList.add('lock-icon');
        lockIcon.innerHTML = '&#128274;'; // Carattere Unicode per l'icona del lucchetto
        premioDiv.appendChild(lockIcon);
  
        const puntiText = document.createElement('div');
        puntiText.classList.add('punti-text');
        puntiText.textContent = `${premio.puntiRichiesti} punti`;
        premioDiv.appendChild(puntiText);
  
        if (giorniPresi >= premio.puntiRichiesti) {
          premioDiv.classList.add('unlocked');
          premioDiv.removeChild(lockIcon);
        }
  
        premiContainer.appendChild(premioDiv);
      });
    }

    // Gestisci il clic sul pulsante "Presa" (corretto)
    presaButton.addEventListener('click', () => {
      const centerSlideIndex = swiper.activeIndex;
      toggleDay(centerSlideIndex + 1); // Attiva/disattiva il giorno centrale
    });
});
