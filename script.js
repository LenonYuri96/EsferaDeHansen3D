// ============================================
// INICIALIZAÇÃO DA CENA 3D
// ============================================
const container = document.getElementById("canvas-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000,
);

if (window.innerWidth < 768) {
  camera.position.set(55, 45, 55);
} else {
  camera.position.set(40, 30, 40);
}
camera.lookAt(15, 10, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true, // ESSENCIAL PARA CAPTURA DO PDF
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2),
);
container.appendChild(renderer.domElement);

const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(container.clientWidth, container.clientHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0";
labelRenderer.domElement.style.left = "0";
labelRenderer.domElement.style.pointerEvents = "none";
container.appendChild(labelRenderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.target.set(15, 10, 10);
controls.maxPolarAngle = Math.PI / 2;

// ============================================
// LUZES
// ============================================
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(luzAmbiente);

const luzDirecional = new THREE.DirectionalLight(0xffffff, 0.9);
luzDirecional.position.set(20, 30, 20);
scene.add(luzDirecional);

const luzPreenchimento = new THREE.PointLight(0x446688, 0.5);
luzPreenchimento.position.set(-10, 10, 20);
scene.add(luzPreenchimento);

// ============================================
// MALHAS DE REFERÊNCIA (GRIDS E PLANOS)
// ============================================
const tamanhoGrade = 60;
const divisoes = 20;

function criarPlanoComBordas(tamanho, cor, posicao, rotacao, opacidade = 0.03) {
  const geometry = new THREE.PlaneGeometry(tamanho, tamanho);
  const material = new THREE.MeshBasicMaterial({
    color: cor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: opacidade,
  });
  const plano = new THREE.Mesh(geometry, material);
  plano.position.copy(posicao);
  plano.rotation.set(rotacao.x, rotacao.y, rotacao.z);
  scene.add(plano);

  const bordas = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: cor }),
  );
  bordas.position.copy(posicao);
  bordas.rotation.set(rotacao.x, rotacao.y, rotacao.z);
  scene.add(bordas);
}

function criarGradePositivaPlano(
  plano,
  tamanho,
  divisoes,
  corPrincipal,
  corSecundaria,
) {
  const grupo = new THREE.Group();
  const step = tamanho / divisoes;

  for (let i = 0; i <= divisoes; i++) {
    const pos = i * step;
    let pontos1, pontos2;

    if (plano === "XY") {
      pontos1 = [
        new THREE.Vector3(0, pos, 0),
        new THREE.Vector3(tamanho, pos, 0),
      ];
      pontos2 = [
        new THREE.Vector3(pos, 0, 0),
        new THREE.Vector3(pos, tamanho, 0),
      ];
    }
    if (plano === "YZ") {
      pontos1 = [
        new THREE.Vector3(0, pos, 0),
        new THREE.Vector3(0, pos, tamanho),
      ];
      pontos2 = [
        new THREE.Vector3(0, 0, pos),
        new THREE.Vector3(0, tamanho, pos),
      ];
    }
    if (plano === "XZ") {
      pontos1 = [
        new THREE.Vector3(0, 0, pos),
        new THREE.Vector3(tamanho, 0, pos),
      ];
      pontos2 = [
        new THREE.Vector3(pos, 0, 0),
        new THREE.Vector3(pos, 0, tamanho),
      ];
    }

    const material = new THREE.LineBasicMaterial({
      color: i % 5 === 0 ? corPrincipal : corSecundaria,
    });

    const linha1 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pontos1),
      material,
    );
    const linha2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pontos2),
      material,
    );

    grupo.add(linha1);
    grupo.add(linha2);
  }
  scene.add(grupo);
}

// Planos grudados aos eixos
criarGradePositivaPlano("XY", 30, 40, 0x999999, 0xdddddd);
criarGradePositivaPlano("YZ", 30, 40, 0x999999, 0xdddddd);
criarGradePositivaPlano("XZ", 30, 40, 0x999999, 0xdddddd);

// ============================================
// EIXOS COM MARCAÇÕES NUMÉRICAS
// ============================================
const axesHelper = new THREE.AxesHelper(30);
scene.add(axesHelper);

function criarRotulo(texto, cor, posicao) {
  const div = document.createElement("div");
  div.textContent = texto;
  div.style.color = cor;
  div.style.fontWeight = "bold";
  div.style.fontSize = "20px";
  div.style.textShadow = "1px 1px 2px black";
  const label = new THREE.CSS2DObject(div);
  label.position.copy(posicao);
  return label;
}

scene.add(criarRotulo("δD", "#ff8888", new THREE.Vector3(32, 0, 0)));
scene.add(criarRotulo("δP", "#88ff88", new THREE.Vector3(0, 32, 0)));
scene.add(criarRotulo("δH", "#8888ff", new THREE.Vector3(0, 0, 32)));

function adicionarTicks(eixo, cor, intervalo, maxValor) {
  for (let i = intervalo; i <= maxValor; i += intervalo) {
    const div = document.createElement("div");
    div.textContent = i;
    div.style.color = cor;
    div.style.fontSize = "14px";
    div.style.fontWeight = "bold";
    div.style.textShadow = "1px 1px 1px black";
    const label = new THREE.CSS2DObject(div);
    if (eixo === "x") label.position.set(i, -1, -1);
    else if (eixo === "y") label.position.set(-1, i, -1);
    else if (eixo === "z") label.position.set(-1, -1, i);
    scene.add(label);
  }
}
adicionarTicks("x", "#ff8888", 5, 30);
adicionarTicks("y", "#88ff88", 5, 30);
adicionarTicks("z", "#8888ff", 5, 30);

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let solvents = [];
let sphereMesh = null;
let solutePoint = null;
let solventGroup = new THREE.Group();
scene.add(solventGroup);

// Info box flutuante
const infoDiv = document.getElementById("solvent-info");

// ============================================
// FUNÇÕES PARA CRIAR/ATUALIZAR ESFERA E SOLUTO
// ============================================
function criarEsfera(radius, centro) {
  if (sphereMesh) scene.remove(sphereMesh);

  const geometry = new THREE.SphereGeometry(radius, 64, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    emissive: 0x112233,
  });
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x66aaff }),
  );

  const grupo = new THREE.Group();
  grupo.add(new THREE.Mesh(geometry, material));
  grupo.add(line);
  grupo.position.copy(centro);
  sphereMesh = grupo;
  scene.add(sphereMesh);
}

function atualizarSoluto(d, p, h) {
  if (solutePoint) scene.remove(solutePoint);

  const geom = new THREE.SphereGeometry(0.9, 20, 20);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // branco
    emissive: 0x333333,
  });
  solutePoint = new THREE.Mesh(geom, mat);
  solutePoint.position.set(d, p, h);
  solutePoint.userData = {
    type: "soluto",
    nome: "Soluto",
    d: d,
    p: p,
    h: h,
    cor: "#ffffff",
  };
  scene.add(solutePoint);
}

// ============================================
// ATUALIZAR SOLVENTES NO 3D
// ============================================
function atualizarSolventes3D() {
  while (solventGroup.children.length > 0) {
    solventGroup.remove(solventGroup.children[0]);
  }

  solvents.forEach((sol) => {
    const geom = new THREE.SphereGeometry(0.3, 12, 12);
    const mat = new THREE.MeshStandardMaterial({
      color: sol.cor,
      emissive: 0x222222,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(sol.d, sol.p, sol.h);
    mesh.userData = { type: "solvent", data: sol };
    solventGroup.add(mesh);
  });

  atualizarTabelaSolventes();
}

// ============================================
// FUNÇÃO PARA EXIBIR INFO NO PAINEL FLUTUANTE
// ============================================
function mostrarInfo(tipo, dados) {
  if (!infoDiv) return;
  infoDiv.classList.remove("d-none");
  infoDiv.style.display = "block";
  if (tipo === "solvent") {
    infoDiv.innerHTML = `
      <strong class="text-info">${dados.nome}</strong><br>
      <span>δD: ${dados.d.toFixed(2)}</span><br>
      <span>δP: ${dados.p.toFixed(2)}</span><br>
      <span>δH: ${dados.h.toFixed(2)}</span><br>
      <span style="color: ${dados.cor};">●</span> Cor: ${dados.cor}
    `;
  } else if (tipo === "soluto") {
    infoDiv.innerHTML = `
      <strong class="text-warning">${dados.nome}</strong><br>
      <span>δD: ${dados.d.toFixed(2)}</span><br>
      <span>δP: ${dados.p.toFixed(2)}</span><br>
      <span>δH: ${dados.h.toFixed(2)}</span><br>
      <span style="color: ${dados.cor};">●</span> Cor: ${dados.cor}
    `;
  }
}

// ============================================
// CLIQUE NO CANVAS (3D)
// ============================================
function onClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const clickableObjects = [...solventGroup.children];
  if (solutePoint) clickableObjects.push(solutePoint);

  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const userData = hit.userData;

    if (userData.type === "solvent") {
      mostrarInfo("solvent", userData.data);
    } else if (userData.type === "soluto") {
      mostrarInfo("soluto", userData);
    }
  } else {
    infoDiv.classList.add("d-none");
    infoDiv.style.display = "none";
  }
}

renderer.domElement.addEventListener("click", onClick);

// ============================================
// ATUALIZAR TABELA E ADICIONAR CLIQUE NAS LINHAS
// ============================================
function atualizarTabelaSolventes() {
  const tbody = document.getElementById("solventTableBody");
  const sD = parseFloat(document.getElementById("soluteD").value);
  const sP = parseFloat(document.getElementById("soluteP").value);
  const sH = parseFloat(document.getElementById("soluteH").value);
  const R = parseFloat(document.getElementById("sphereRadius").value);

  tbody.innerHTML = "";
  solvents.forEach((sol, index) => {
    // Cálculo com Fator 4 no parâmetro de dispersão
    const dist = Math.sqrt(
      4 * Math.pow(sol.d - sD, 2) +
        Math.pow(sol.p - sP, 2) +
        Math.pow(sol.h - sH, 2),
    );
    const dentro = dist <= R ? "✅ Sim" : "❌ Não";
    const linha = document.createElement("tr");
    linha.style.cursor = "pointer";
    linha.setAttribute("data-solvent-index", index);
    linha.innerHTML = `
      <td>${sol.nome}</td>
      <td>${sol.d.toFixed(2)}</td>
      <td>${sol.p.toFixed(2)}</td>
      <td>${sol.h.toFixed(2)}</td>
      <td>${dist.toFixed(2)}</td>
      <td>${dentro}</td>
      <td><button class="btn btn-outline-danger btn-sm remove-solvent" data-index="${index}"><i class="bi bi-trash"></i></button></td>
    `;
    tbody.appendChild(linha);
  });

  document.querySelectorAll("#solventTableBody tr").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest(".remove-solvent")) return;
      const idx = row.getAttribute("data-solvent-index");
      if (idx !== null) {
        const sol = solvents[parseInt(idx)];
        if (sol) mostrarInfo("solvent", sol);
      }
    });
  });

  document.querySelectorAll(".remove-solvent").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = e.currentTarget.getAttribute("data-index");
      solvents.splice(idx, 1);
      atualizarSolventes3D();
      infoDiv.classList.add("d-none");
      infoDiv.style.display = "none";
    });
  });

  atualizarSugestaoIA();
}

// ============================================
// IA: Painel Analítico Industrial
// ============================================
function atualizarSugestaoIA() {
  const sD = parseFloat(document.getElementById("soluteD").value);
  const sP = parseFloat(document.getElementById("soluteP").value);
  const sH = parseFloat(document.getElementById("soluteH").value);
  const R = parseFloat(document.getElementById("sphereRadius").value);

  const nomeSoluto = "Polímero/Soluto Alvo";

  if (solvents.length === 0) {
    document.getElementById("iaSuggestion").innerHTML =
      "<p class='text-muted'>Adicione solventes no banco para gerar a análise industrial.</p>";
    return;
  }

  const analise = solvents.map((s) => {
    const deltaD2 = 4 * Math.pow(s.d - sD, 2);
    const deltaP2 = Math.pow(s.p - sP, 2);
    const deltaH2 = Math.pow(s.h - sH, 2);
    const dist = Math.sqrt(deltaD2 + deltaP2 + deltaH2);
    const red = dist / (R || 1);

    let diferencaCritica = "Dispersão (δD)";
    let maxDelta = deltaD2;
    if (deltaP2 > maxDelta) {
      diferencaCritica = "Polaridade (δP)";
      maxDelta = deltaP2;
    }
    if (deltaH2 > maxDelta) {
      diferencaCritica = "Pontes de Hidrogênio (δH)";
      maxDelta = deltaH2;
    }

    return { ...s, dist, red, diferencaCritica };
  });

  analise.sort((a, b) => a.dist - b.dist);

  const otimos = analise.filter((s) => s.red <= 1.0);
  const parciais = analise.filter((s) => s.red > 1.0 && s.red <= 1.5);

  const top3 = analise.slice(0, 3);
  const melhor = top3[0];

  let relatorioHTML = `
    <div style="background-color: var(--bs-light); padding: 18px; border-radius: 8px; border-left: 6px solid #6f42c1; font-size: 0.95em;">
      <h5 style="color: #6f42c1; font-weight: bold; margin-bottom: 15px;"><i class="bi bi-cpu"></i> Parecer Analítico do Sistema</h5>
  `;

  if (otimos.length > 0) {
    relatorioHTML += `
      <p>Encontramos <strong>${otimos.length} solvente(s) puro(s)</strong> capazes de dissolver completamente o ${nomeSoluto} (RED ≤ 1.0).</p>
      <div style="margin-bottom: 15px;">
        <strong>Top 3 Recomendações:</strong>
        <ol style="margin-top: 5px; padding-left: 20px;">
          ${top3
            .map(
              (s) => `
            <li>
              <strong>${s.nome}</strong> 
              <span class="badge ${s.red <= 1.0 ? "bg-success" : "bg-warning text-dark"} ms-2">RED: ${s.red.toFixed(2)}</span><br>
              <span style="font-size: 0.85em; color: gray;">Limitação principal: ${s.diferencaCritica}</span>
            </li>
          `,
            )
            .join("")}
        </ol>
      </div>
    `;
  } else {
    relatorioHTML += `
      <div class="alert alert-warning" style="padding: 10px;">
        <strong>Atenção:</strong> Nenhum solvente puro no banco atual apresenta dissolução garantida (RED ≤ 1.0).
      </div>
      <p style="margin-bottom: 10px;">O mais próximo é o <strong>${melhor.nome}</strong> (RED: ${melhor.red.toFixed(2)}). Ele causará inchaço (swelling) no material, mas não o dissolverá completamente devido à diferença em <strong>${melhor.diferencaCritica}</strong>.</p>
      
      <div style="background-color: rgba(255,193,7,0.2); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
        <i class="bi bi-lightbulb-fill text-warning"></i> <strong>Estratégia Industrial (Blend):</strong> 
        Recomenda-se criar uma mistura (co-solvente). Se o ${melhor.nome} falha por baixa polaridade, adicione um solvente polar da lista (como Cetonas ou Álcoois) para trazer as coordenadas médias do blend para dentro da esfera (RED < 1).
      </div>
    `;
  }

  relatorioHTML += `
      <hr style="opacity: 0.2;">
      <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: var(--bs-secondary);">
        <span><i class="bi bi-database"></i> Avaliados: ${analise.length}</span>
        <span><i class="bi bi-check-circle text-success"></i> Ideais: ${otimos.length}</span>
        <span><i class="bi bi-exclamation-circle text-warning"></i> Parciais: ${parciais.length}</span>
      </div>
    </div>
  `;

  document.getElementById("iaSuggestion").innerHTML = relatorioHTML;
}

// ============================================
// RECOMENDAR (ORDENAÇÃO)
// ============================================
function recomendar() {
  const sD = parseFloat(document.getElementById("soluteD").value);
  const sP = parseFloat(document.getElementById("soluteP").value);
  const sH = parseFloat(document.getElementById("soluteH").value);

  const comDistancia = solvents.map((s) => ({
    ...s,
    dist: Math.sqrt(
      4 * Math.pow(s.d - sD, 2) + Math.pow(s.p - sP, 2) + Math.pow(s.h - sH, 2),
    ),
  }));
  comDistancia.sort((a, b) => a.dist - b.dist);

  solvents = comDistancia.map((item) => {
    return { nome: item.nome, d: item.d, p: item.p, h: item.h, cor: item.cor };
  });

  atualizarSolventes3D();
}

// ============================================
// EXPORTAR PDF
// ============================================
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("landscape", "mm", "a4");

  const margin = 15;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;

  let currentY = margin;

  const sD = parseFloat(document.getElementById("soluteD").value);
  const sP = parseFloat(document.getElementById("soluteP").value);
  const sH = parseFloat(document.getElementById("soluteH").value);
  const R = parseFloat(document.getElementById("sphereRadius").value);

  html2canvas(container, {
    scale: 2.5,
    backgroundColor: "#ffffff",
    useCORS: true,
  }).then((canvas3D) => {
    const imgData = canvas3D.toDataURL("image/png");
    const aspect = canvas3D.height / canvas3D.width;

    const max3DHeight = pageHeight * 0.55;
    let imgWidth = usableWidth;
    let imgHeight = imgWidth * aspect;

    if (imgHeight > max3DHeight) {
      imgHeight = max3DHeight;
      imgWidth = imgHeight / aspect;
    }

    const centerX = (pageWidth - imgWidth) / 2;

    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.text("Relatório Técnico – Esfera de Hansen", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 10;
    pdf.setDrawColor(180);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    pdf.addImage(imgData, "PNG", centerX, currentY, imgWidth, imgHeight);
    currentY += imgHeight + 10;

    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Parâmetros do Soluto", margin, currentY);
    currentY += 6;

    pdf.setFont(undefined, "normal");
    pdf.rect(margin, currentY, usableWidth, 18);
    pdf.text(`δD: ${sD}`, margin + 5, currentY + 6);
    pdf.text(`δP: ${sP}`, margin + 60, currentY + 6);
    pdf.text(`δH: ${sH}`, margin + 115, currentY + 6);
    pdf.text(`Raio (R): ${R}`, margin + 170, currentY + 6);

    currentY += 25;

    pdf.setFont(undefined, "bold");
    pdf.text("Avaliação dos Solventes", margin, currentY);
    currentY += 8;
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(10);

    solvents.forEach((sol, index) => {
      const dist = Math.sqrt(
        4 * Math.pow(sol.d - sD, 2) +
          Math.pow(sol.p - sP, 2) +
          Math.pow(sol.h - sH, 2),
      );

      const dentro = dist <= R ? "Compatível" : "Não compatível";

      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      const linha = `${index + 1}. ${sol.nome}  |  Distância (Ra): ${dist.toFixed(2)}  |  ${dentro}`;
      pdf.text(linha, margin, currentY);

      currentY += 5;
    });

    currentY += 8;

    const ordenados = solvents
      .map((s) => ({
        ...s,
        dist: Math.sqrt(
          4 * Math.pow(s.d - sD, 2) +
            Math.pow(s.p - sP, 2) +
            Math.pow(s.h - sH, 2),
        ),
      }))
      .sort((a, b) => a.dist - b.dist);

    const melhor = ordenados[0];
    const compativeis = ordenados.filter((s) => s.dist <= R);

    if (currentY > pageHeight - margin - 20) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Análise Técnica Conclusiva", margin, currentY);
    currentY += 8;

    pdf.setFont(undefined, "normal");
    pdf.setFontSize(11);

    const textoAnalise = `
O solvente com menor distância paramétrica é ${melhor.nome},
com valor Ra de ${melhor.dist.toFixed(2)}.

Total de solventes avaliados: ${solvents.length}.
Solventes dentro da esfera (Mistura Estável): ${compativeis.length}.
Solventes fora da esfera (Separação de Fases): ${solvents.length - compativeis.length}.

Lembrando que o cálculo leva em consideração a diferença relativa de energia (RED)
e o fator de peso correto (x4) para as interações de dispersão (δD).
    `;

    const linhas = pdf.splitTextToSize(textoAnalise, usableWidth);
    pdf.text(linhas, margin, currentY);

    pdf.save(`hansen_relatorio_${new Date().toISOString().slice(0, 10)}.pdf`);
  });
}

// ============================================
// CARREGAR SOLVENTES INICIAIS (BANCO INDUSTRIAL)
// ============================================
function carregarSolventesIniciais() {
  solvents = [
    // Água e Álcoois
    { nome: "Água", d: 15.5, p: 16.0, h: 42.3, cor: "#0077b6" },
    { nome: "Metanol", d: 15.1, p: 12.3, h: 22.3, cor: "#023e8a" },
    { nome: "Etanol", d: 15.8, p: 8.8, h: 19.4, cor: "#00ccff" },
    { nome: "Isopropanol (IPA)", d: 15.8, p: 6.1, h: 16.4, cor: "#48cae4" },
    { nome: "n-Butanol", d: 16.0, p: 5.7, h: 15.8, cor: "#90e0ef" },
    { nome: "Glicerol", d: 17.4, p: 12.1, h: 29.3, cor: "#9d4edd" },
    { nome: "Propilenoglicol", d: 16.8, p: 9.4, h: 23.3, cor: "#c77dff" },

    // Cetonas
    { nome: "Acetona", d: 15.5, p: 10.4, h: 7.0, cor: "#e76f51" },
    { nome: "MEK", d: 16.0, p: 9.0, h: 5.1, cor: "#e9c46a" },
    { nome: "MIBK", d: 15.3, p: 6.1, h: 4.1, cor: "#f4a261" },
    { nome: "Ciclohexanona", d: 17.8, p: 6.3, h: 5.1, cor: "#d62828" },

    // Ésteres
    { nome: "Acetato de Etila", d: 15.8, p: 5.3, h: 7.2, cor: "#ffb703" },
    { nome: "Acetato de Butila", d: 15.8, p: 3.7, h: 6.3, cor: "#fb8500" },
    { nome: "Propionato de Etila", d: 15.5, p: 5.1, h: 5.5, cor: "#ffaa00" },

    // Hidrocarbonetos Aromáticos
    { nome: "Benzeno", d: 18.4, p: 0.0, h: 2.0, cor: "#606c38" },
    { nome: "Tolueno", d: 18.0, p: 1.4, h: 2.0, cor: "#283618" },
    { nome: "Xileno (Mistura)", d: 17.6, p: 1.0, h: 3.1, cor: "#dda15e" },
    { nome: "Estireno", d: 18.6, p: 1.0, h: 4.1, cor: "#bc6c25" },

    // Hidrocarbonetos Alifáticos
    { nome: "n-Hexano", d: 14.9, p: 0.0, h: 0.0, cor: "#adb5bd" },
    { nome: "n-Heptano", d: 15.3, p: 0.0, h: 0.0, cor: "#6c757d" },
    { nome: "Ciclohexano", d: 16.8, p: 0.0, h: 0.2, cor: "#495057" },

    // Solventes Clorados
    { nome: "Diclorometano (DCM)", d: 18.2, p: 6.3, h: 6.1, cor: "#52796f" },
    { nome: "Clorofórmio", d: 17.8, p: 3.1, h: 5.7, cor: "#8ab17d" },
    { nome: "Tricloroetileno", d: 18.0, p: 3.1, h: 5.3, cor: "#2f3e46" },

    // Éteres e Apróticos Polares
    { nome: "THF", d: 16.8, p: 5.7, h: 8.0, cor: "#8338ec" },
    { nome: "Dioxano", d: 19.0, p: 1.8, h: 7.4, cor: "#3a0ca3" },
    { nome: "DMF", d: 17.4, p: 13.7, h: 11.3, cor: "#f15bb5" },
    { nome: "DMSO", d: 18.4, p: 16.4, h: 10.2, cor: "#ff006e" },
    { nome: "NMP", d: 18.0, p: 12.3, h: 7.2, cor: "#c1121f" },

    // Química Verde
    { nome: "D-Limoneno", d: 16.5, p: 1.4, h: 3.3, cor: "#38b000" },
    { nome: "Lactato de Etila", d: 16.0, p: 7.6, h: 12.5, cor: "#70e000" },
    { nome: "Gama-Valerolactona", d: 18.3, p: 13.0, h: 6.2, cor: "#008000" },
  ];

  atualizarSolventes3D();
}

// ============================================
// EVENTOS DOS CONTROLES HTML
// ============================================
document.getElementById("updateSoluteBtn").addEventListener("click", () => {
  const d = parseFloat(document.getElementById("soluteD").value);
  const p = parseFloat(document.getElementById("soluteP").value);
  const h = parseFloat(document.getElementById("soluteH").value);
  const r = parseFloat(document.getElementById("sphereRadius").value);

  criarEsfera(r, new THREE.Vector3(d, p, h));
  atualizarSoluto(d, p, h);
  atualizarSolventes3D();
});

document.getElementById("addSolventBtn").addEventListener("click", () => {
  const nome = document.getElementById("solventName").value.trim();
  if (!nome) {
    alert("Digite um nome para o solvente");
    return;
  }
  const d = parseFloat(document.getElementById("solventD").value);
  const p = parseFloat(document.getElementById("solventP").value);
  const h = parseFloat(document.getElementById("solventH").value);
  const cor = document.getElementById("solventColor").value;

  solvents.push({ nome, d, p, h, cor });
  atualizarSolventes3D();

  document.getElementById("solventName").value = "";
  document.getElementById("solventD").value = "0.0";
  document.getElementById("solventP").value = "0.0";
  document.getElementById("solventH").value = "0.0";
});

document.getElementById("clearSolventsBtn").addEventListener("click", () => {
  solvents = [];
  atualizarSolventes3D();
  infoDiv.classList.add("d-none");
  infoDiv.style.display = "none";
});

document.getElementById("recommendBtn").addEventListener("click", recomendar);
document.getElementById("exportPdfBtn").addEventListener("click", exportPDF);

// ============================================
// INICIALIZAÇÃO
// ============================================
document.getElementById("soluteD").value = 16.5; // Exemplo genérico
document.getElementById("soluteP").value = 5.0;
document.getElementById("soluteH").value = 5.0;
document.getElementById("sphereRadius").value = 5.0;

criarEsfera(5.0, new THREE.Vector3(16.5, 5, 5));
atualizarSoluto(16.5, 5, 5);
carregarSolventesIniciais();

// ============================================
// ANIMAÇÃO
// ============================================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
animate();

// ============================================
// REDIMENSIONAMENTO RESPONSIVO
// ============================================
function resizeScene() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (width === 0 || height === 0) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2),
  );

  labelRenderer.setSize(width, height);

  if (window.innerWidth < 576) {
    camera.position.set(60, 50, 60);
  } else if (window.innerWidth < 992) {
    camera.position.set(50, 40, 50);
  } else {
    camera.position.set(40, 30, 40);
  }

  camera.lookAt(15, 10, 10);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

window.addEventListener("resize", resizeScene);
window.addEventListener("orientationchange", () =>
  setTimeout(resizeScene, 300),
);
window.addEventListener("load", resizeScene);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) resizeScene();
});

resizeScene();

// ============================================
// ALTERNÂNCIA DE TEMA (CLARO/ESCURO)
// ============================================
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function updateThemeIcon(isDark) {
  const icon = themeToggle.querySelector("i");
  if (icon) {
    icon.className = isDark ? "bi bi-moon-fill" : "bi bi-sun-fill";
  }
}

const savedTheme = localStorage.getItem("hansenTheme");
if (savedTheme === "light") {
  body.classList.remove("dark-mode");
  body.classList.add("light-mode");
  updateThemeIcon(false);
} else {
  body.classList.add("dark-mode");
  updateThemeIcon(true);
}

themeToggle.addEventListener("click", () => {
  if (body.classList.contains("light-mode")) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("hansenTheme", "dark");
    updateThemeIcon(true);
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("hansenTheme", "light");
    updateThemeIcon(false);
  }
});
