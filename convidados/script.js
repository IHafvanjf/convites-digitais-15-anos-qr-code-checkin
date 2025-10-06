document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('detailsModal');
  const spanClose = modal.querySelector('.close');
  const modalNome = document.getElementById('modalNome');
  const modalAcompanhante = document.getElementById('modalAcompanhante');
  const removeBtn = document.getElementById('removeBtn');
  let usuarioSelecionadoId = null;

  // Função de toast moderno
  function mostrarToast(mensagem, corFundo = "#4ade80") {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.style.backgroundColor = corFundo;
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }

  // Carregar usuários
  fetch("listar_usuarios.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#guest-table tbody");
      tbody.innerHTML = "";

      data.forEach(usuario => {
        const tr = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = usuario.apelido;

        const tdPresente = document.createElement("td");
        const span = document.createElement("span");
        span.className = "badge " + (usuario.presente === "Sim" ? "badge-yes" : "badge-no");
        span.textContent = usuario.presente;
        tdPresente.appendChild(span);

        const tdDetalhes = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "details-btn";
        btn.innerHTML = '<i class="fa-solid fa-ellipsis-h"></i>';
        btn.dataset.id = usuario.id;
        btn.dataset.nome = usuario.apelido;
        btn.dataset.acompanhante = "Não"; // Pode adaptar no futuro

        btn.addEventListener("click", () => {
          modal.style.display = "block";
          modalNome.textContent = usuario.apelido;
          modalAcompanhante.textContent = btn.dataset.acompanhante;
          usuarioSelecionadoId = usuario.id;
        });

        tdDetalhes.appendChild(btn);
        tr.appendChild(tdNome);
        tr.appendChild(tdPresente);
        tr.appendChild(tdDetalhes);
        tbody.appendChild(tr);
      });
    });

  // Fechar modal
  spanClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Remover usuário
  removeBtn.addEventListener("click", () => {
    if (usuarioSelecionadoId && confirm("Tem certeza que deseja remover este convidado?")) {
      fetch("remover_usuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: usuarioSelecionadoId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          mostrarToast("Usuário removido com sucesso!");
          setTimeout(() => location.reload(), 1200);
        } else {
          mostrarToast("Erro ao remover usuário.", "#f87171");
        }
      })
      .catch(() => {
        mostrarToast("Erro na conexão com o servidor.", "#f87171");
      });
    }
  });
});