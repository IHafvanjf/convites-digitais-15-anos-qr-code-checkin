// dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  const allSections = Array.from(document.body.children)
    .filter(el => el.id !== 'present-form');
  const presentForm = document.getElementById('present-form');
  const btnBack = document.getElementById('btn-back');
  const presentImg = document.getElementById('present-img');
  const presentTitle = document.getElementById('present-title');
  const quotasSection = document.getElementById('present-quotas');
  const loaderOverlay = document.getElementById('sobrecarga-loader');

  const presentImages = {
    'Viagem dos Sonhos': '/img/presente5.jpg',
    'Kit de Maquiagem': '/img/presente3.jpg',
    'Conjunto de Joias': '/img/presente1.jpg',
    'Iphone': '/img/presente4.jpg',
    'Câmera Instantânea': '/img/presente2.jpg',
    'Perfume e Acessórios': '/img/presente6.jpg',
    'Curso de Dança': '/img/presente7.jpg',
    'Pix': '/img/presente8.jpg'
  };

  const presentValues = {
    'Viagem dos Sonhos': 5000,
    'Iphone': 4000
  };

  document.querySelectorAll('.btn-present').forEach(function(button) {
    button.addEventListener('click', function(event) {
      const card = event.currentTarget.closest('.card');
      const cardTitle = card.querySelector('.title').textContent;

      presentImg.src = presentImages[cardTitle] || '/img/default-present.jpg';
      presentImg.alt = cardTitle;
      presentTitle.textContent = cardTitle;

      if (presentValues[cardTitle] !== undefined) {
        quotasSection.classList.remove('hidden');
        const fullValue = presentValues[cardTitle];
        const quotaValue = Math.floor(fullValue / 10);

        document.querySelectorAll('.quota-value').forEach(function(span) {
          span.textContent = quotaValue.toLocaleString('pt-BR');
        });
        document.querySelector('.full-value').textContent = fullValue.toLocaleString('pt-BR');

        updateQuotasSection(quotaValue, fullValue);
      } else {
        quotasSection.classList.add('hidden');
      }

      allSections.forEach(function(section) {
        section.classList.add('hidden');
      });
      presentForm.classList.remove('hidden');
      presentForm.classList.add('form-enter');
      setTimeout(function() {
        presentForm.classList.remove('form-enter');
      }, 500);
    });
  });

  function updateQuotasSection(quotaValue, fullValue) {
    quotasSection.innerHTML = `
      <p>Este presente pode ser adquirido em cotas:</p>
      <div class="quota-info">
        <p>Valor por cota: R$ ${quotaValue.toLocaleString('pt-BR')}</p>
        <p>Total de cotas disponíveis: 10</p>
      </div>
      <div class="quota-custom">
        <label for="quota-quantity">Quantidade de cotas:</label>
        <div class="quota-input-group">
          <button type="button" class="quota-minus">–</button>
          <input type="number" id="quota-quantity" min="1" max="10" value="1">
          <button type="button" class="quota-plus">+</button>
        </div>
        <p class="quota-total">Total: R$ ${quotaValue.toLocaleString('pt-BR')}</p>
      </div>
      <button type="button" class="quota-btn full" data-quotas="full">
        Presente completo (R$ ${fullValue.toLocaleString('pt-BR')})
      </button>
    `;

    const inputQuantity = document.getElementById('quota-quantity');
    const btnMinus = quotasSection.querySelector('.quota-minus');
    const btnPlus = quotasSection.querySelector('.quota-plus');
    const spanTotal = quotasSection.querySelector('.quota-total');

    function refreshTotal() {
      const qtd = parseInt(inputQuantity.value, 10) || 1;
      const total = quotaValue * qtd;
      spanTotal.textContent = `Total: R$ ${total.toLocaleString('pt-BR')}`;
    }

    inputQuantity.addEventListener('input', function() {
      if (this.value > 10) this.value = 10;
      if (this.value < 1) this.value = 1;
      refreshTotal();
    });
    btnMinus.addEventListener('click', function() {
      if (inputQuantity.value > 1) {
        inputQuantity.value--;
        refreshTotal();
      }
    });
    btnPlus.addEventListener('click', function() {
      if (inputQuantity.value < 10) {
        inputQuantity.value++;
        refreshTotal();
      }
    });
  }

  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('quota-btn')) {
      event.preventDefault();
      document.querySelectorAll('.quota-btn').forEach(function(b) {
        b.classList.remove('selected');
      });
      event.target.classList.add('selected');

      if (event.target.classList.contains('full')) {
        const inp = document.getElementById('quota-quantity');
        if (inp) inp.value = '';
      } else {
        const fullBtn = document.querySelector('.quota-btn.full');
        if (fullBtn) fullBtn.classList.remove('selected');
      }
    }
  });

  btnBack.addEventListener('click', function() {
    presentForm.classList.add('form-exit');
    setTimeout(function() {
      presentForm.classList.add('hidden');
      presentForm.classList.remove('form-exit');
      allSections.forEach(function(section) {
        section.classList.remove('hidden');
      });
    }, 300);
  });

  document.getElementById('form-present').addEventListener('submit', function(event) {
    event.preventDefault();

    const presentName = presentTitle.textContent;

    if (presentValues[presentName] !== undefined) {
      const selected = document.querySelector('.quota-btn.selected');
      const qtyInput = document.getElementById('quota-quantity');
      let chosenQuotas, amount;

      if (selected && selected.classList.contains('full')) {
        chosenQuotas = 'full';
        amount = presentValues[presentName];
      } else if (qtyInput && qtyInput.value) {
        const qtd = parseInt(qtyInput.value, 10);
        if (isNaN(qtd) || qtd < 1 || qtd > 10) {
          alert('Por favor, selecione uma quantidade válida de cotas (1-10)!');
          return;
        }
        chosenQuotas = qtd;
        amount = Math.floor(presentValues[presentName] / 10) * qtd;
      } else {
        alert('Por favor, selecione uma opção de cotas!');
        return;
      }

      console.log(`Usuário ${nameInput} escolheu ${chosenQuotas} de ${presentName}, total R$ ${amount.toLocaleString('pt-BR')}`);
    }

    presentForm.classList.add('hidden');
    loaderOverlay.classList.remove('oculto');
  });

  // ─── inicializa o slider principal (seção .carousel) ───
  ;(function() {
    const slides = document.querySelectorAll('.carousel .slide');
    let currentIndex = 0;
    function goTo(index) {
      slides[currentIndex].classList.remove('active');
      currentIndex = (index + slides.length) % slides.length;
      slides[currentIndex].classList.add('active');
    }
    slides[0].classList.add('active');
    setInterval(() => goTo(currentIndex + 1), 4000);
  })();

  // ─── inicializa o Swiper na seção de fotos ───
    window.swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 2.75,
    speed: 600,
    coverflowEffect: {
      rotate: 10,
      stretch: 0,
      depth: 100,
      modifier: 3,
      slideShadows: true,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: false,
    },
  });

}); // end DOMContentLoaded

// scroll-reveal for all other sections
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('section:not(.carousel)').forEach(section => {
  section.classList.add('animate-on-scroll');
  revealObserver.observe(section);
});

// redirect form-present to checkout
document.addEventListener('DOMContentLoaded', () => {
  const formPresent = document.getElementById('form-present');
  if (formPresent) {
    formPresent.addEventListener('submit', e => {
      e.preventDefault();
      window.location.href = '../checkout/index.html';
    });
  }
});

const usuario = JSON.parse(sessionStorage.getItem("usuario"));

if (!usuario || !usuario.email || !usuario.apelido) {
  window.location.href = "../login/index.html";
} else {
  // Valida com o back-end se ainda existe
  fetch("config/validar_usuario.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: usuario.email,
      apelido: usuario.apelido
    })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.valido) {
      sessionStorage.removeItem("usuario");
      window.location.href = "../login/index.html";
    } else {
      document.getElementById("usuario-nome").textContent = "Olá, " + usuario.apelido + "!";
    }
  })
  .catch(() => {
    sessionStorage.removeItem("usuario");
    window.location.href = "../login/index.html";
  });
}

async function carregarFotosSwiper() {
  try {
    const res = await fetch('listar_fotos.php');
    const fotos = await res.json();

    const swiperWrapper = document.getElementById('swiper-fotos');
    swiperWrapper.innerHTML = ''; // limpa o conteúdo fixo

    fotos.forEach(foto => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      const img = document.createElement('img');
      img.src = foto;
      img.alt = 'Foto da festa';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '12px';

      slide.appendChild(img);
      swiperWrapper.appendChild(slide);
    });

    // Atualiza o swiper após carregar dinamicamente
    if (window.swiper && window.swiper.update) {
      window.swiper.update();
    }
  } catch (err) {
    console.error('Erro ao carregar fotos do swiper:', err);
  }
}

carregarFotosSwiper();

// No final do DOMContentLoaded
document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("usuario");
  window.location.href = "../login/index.html";
});
