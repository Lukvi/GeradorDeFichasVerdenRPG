// Atualização com posicionamento do carimbo de status inquisitorial no centro inferior (fora da área de texto)
const schema = [
    { 
        title: "Identidade e Origem", 
        fields: ["Nome", "Sobrenome", "Pronuncia", "Idade", "Signo"] 
    },
    { 
        title: "Traços Físicos e Marcas", 
        fields: ["Altura", "Genero", "Raca", "Olhos", "Cabelo", "Pele", "Marcas"] 
    },
    { 
        title: "Psique e Desvios", 
        fields: ["Medos", "Ambicoes", "Gostos", "Desgostos", "Hobbies"] 
    },
    { 
        title: "Perícias", 
        fields: ["Pericia1", "Pericia2", "Pericia3"] 
    },
    { 
        title: "Estatuto e Linhagem", 
        fields: ["Classe", "Subclasse", "Faccao", "Arvore"] 
    },
    { 
        title: "Registros Suplementares", 
        fields: ["EstadoCivil", "Orientacao", "Apelido", "Titulo"] 
    }
];

// Mapa de correspondência rigorosa entre Classes e Subclasses
const subclassesPorClasse = {
    "Assassino": ["Assassino Salafrário", "Assassino Venenoso", "Assassino das Sombras"],
    "Bardo": ["Bardo Banjistã", "Bardo Flautista", "Bardo Tamborista", "Bardo da Maré"],
    "Bruxo": ["Bruxo Necromante", "Bruxo Controlador", "Bruxo Ceifador"],
    "Cartomante": ["Cartomante Baralhista", "Cartomante Enganador", "Cartomante Festeiro"],
    "Caçador": ["Caçador Ágil", "Caçador Rastreador", "Caçador de Feras"],
    "Druida": ["Druida Pele de Árvore", "Druida Feral", "Druida Verdeal"],
    "Feiticeiro": ["Feiticeiro Rúnico", "Feiticeiro Impuro", "Feiticeiro Evocador"],
    "Forfatter": ["Forfatter Son"],
    "Golemante": ["Golemante Artesão", "Golemante Elemental", "Golemante Criador"],
    "Ladino": ["Ladino Mercenário"],
    "Paladino": ["Paladino Divino", "Paladino Sombrio"],
    "Pirata": ["Pirata Pistoleiro", "Pirata Duelista", "Pirata Caçador de Tesouros"],
    "Monge": ["Monge Alcoólatra", "Monge Espiritual", "Monge da Névoa"],
    "Xamã": ["Xamã Elemental", "Xamã Espiritual"],
    "Mago": ["Mago Arcano", "Mago Vulcânico", "Mago de Gelo"],
    "Guerreiro": ["Guerreiro Assassino", "Guerreiro de Ferro", "Guerreiro Sanguinário"],
    "Sacerdote": ["Sacerdote Sombrio", "Sacerdote da Luz", "Sacerdote Purificante"]
};

// Lista de Inquisidores da Clave
const listaInquisidoresClave = [
    "Liah McClair",
    "Cícero Vane",
    "Vespera Nyx",
    "Thoren Kael",
    "Canaaris Thtfoon",
    "Efraim Blackwood",
    "Kaelen Vost"
];

let avatarBase64 = "";

function getVal(id) {
    const el = document.getElementById(id);
    return el && el.value ? el.value : "---";
}

function formatarNomeCampo(f) {
    const dicionarioCampos = {
        "Pronuncia": "Pronúncia",
        "Raca": "Raça",
        "Ambicoes": "Ambições",
        "Pericia1": "Perícia I",
        "Pericia2": "Perícia II",
        "Pericia3": "Perícia III",
        "Faccao": "Facção",
        "Arvore": "Árvore Genealógica",
        "Orientacao": "Orientação"
    };
    return dicionarioCampos[f] || f;
}

function atualizarSubclasses(subclasseSelecionada = "") {
    const classeSelect = document.getElementById("Classe");
    const subclasseSelect = document.getElementById("Subclasse");
    if (!classeSelect || !subclasseSelect) return;
    const classeEscolhida = classeSelect.value;

    subclasseSelect.innerHTML = '<option value="">Selecione...</option>';

    if (classeEscolhida && subclassesPorClasse[classeEscolhida]) {
        subclasseSelect.disabled = false;
        subclassesPorClasse[classeEscolhida].forEach(sub => {
            const opt = document.createElement("option");
            opt.value = sub;
            opt.textContent = sub;
            if (sub === subclasseSelecionada) {
                opt.selected = true;
            }
            subclasseSelect.appendChild(opt);
        });
    } else {
        subclasseSelect.disabled = true;
        subclasseSelect.innerHTML = '<option value="">Selecione uma classe primeiro</option>';
    }
}

function saveData() {
    const data = {};
    schema.forEach(s => {
        s.fields.forEach(f => {
            const el = document.getElementById(f);
            if (el) data[f] = el.value;
        });
    });
    
    const statusEl = document.getElementById('StatusInquisitorial');
    if (statusEl) data['StatusInquisitorial'] = statusEl.value;
    const inqEl = document.getElementById('InquisidorAssinatura');
    if (inqEl) data['InquisidorAssinatura'] = inqEl.value;
    const dataInqEl = document.getElementById('DataInquisitorial');
    if (dataInqEl) data['DataInquisitorial'] = dataInqEl.value;

    data['avatar'] = avatarBase64;
    localStorage.setItem('clave_registro_medieval', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('clave_registro_medieval');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            schema.forEach(s => {
                s.fields.forEach(f => {
                    const el = document.getElementById(f);
                    if (el && data[f]) {
                        if (f === 'Classe') {
                            el.value = data[f];
                            atualizarSubclasses(data['Subclasse']);
                        } else if (f !== 'Subclasse') {
                            el.value = data[f];
                        }
                    }
                });
            });
            const statusEl = document.getElementById('StatusInquisitorial');
            if (statusEl && data['StatusInquisitorial']) {
                statusEl.value = data['StatusInquisitorial'];
            }
            const dataInqEl = document.getElementById('DataInquisitorial');
            if (dataInqEl && data['DataInquisitorial']) {
                dataInqEl.value = data['DataInquisitorial'];
            }
            if (data['avatar']) {
                avatarBase64 = data['avatar'];
                const img = document.getElementById('avatar-preview');
                if (img) {
                    img.src = avatarBase64;
                    img.style.display = 'block';
                }
            }
        } catch (e) {
            console.error("Erro ao carregar registros:", e);
        }
    }
    
    const selectInq = document.getElementById('InquisidorAssinatura');
    const savedDataParsed = saved ? JSON.parse(saved) : {};
    if (selectInq && savedDataParsed['InquisidorAssinatura']) {
        selectInq.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = savedDataParsed['InquisidorAssinatura'];
        opt.textContent = savedDataParsed['InquisidorAssinatura'];
        opt.selected = true;
        selectInq.appendChild(opt);
        selectInq.disabled = true;
    }

    atualizarSistemaPericias();
}

function clearData() {
    if (confirm("ATENÇÃO: Deseja realmente expurgar este registro dos arquivos da Clave?")) {
        localStorage.removeItem('clave_registro_medieval');
        schema.forEach(s => {
            s.fields.forEach(f => {
                const el = document.getElementById(f);
                if (el) el.value = "";
            });
        });
        const sub = document.getElementById('Subclasse');
        if (sub) {
            sub.disabled = true;
            sub.innerHTML = '<option value="">Selecione uma classe primeiro</option>';
        }
        avatarBase64 = "";
        const img = document.getElementById('avatar-preview');
        if (img) {
            img.src = "";
            img.style.display = 'none';
        }
        inicializarInquisidorAleatorio();
    }
}

document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        saveData();
    }
});

function loadAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarBase64 = e.target.result;
            const img = document.getElementById('avatar-preview');
            if (img) {
                img.src = avatarBase64;
                img.style.display = 'block';
            }
            saveData();
        };
        reader.readAsDataURL(file);
    }
}

function prepararEstilosCarimbos() {
    if (!document.getElementById('font-cursiva-inquisidor')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'font-cursiva-inquisidor';
        styleTag.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@700&display=swap');
            @keyframes carimboAnimacao {
                0% { transform: scale(3) rotate(-15deg); opacity: 0; }
                50% { transform: scale(0.9) rotate(-3deg); opacity: 0.8; }
                70% { transform: scale(1.1) rotate(2deg); opacity: 1; }
                100% { transform: scale(1) rotate(-4deg); opacity: 0.95; }
            }
            .carimbo-efento-animado {
                animation: carimboAnimacao 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
        `;
        document.head.appendChild(styleTag);
    }
}

function obterHtmlCarimboStatus(status) {
    if (!status || status === "---") return "";

    let corCarimbo = "#7a1c1c"; 
    let rotacao = "-4deg";

    switch(status.toUpperCase()) {
        case "VIGIADO":
            corCarimbo = "#1b4d3e"; 
            rotacao = "-3deg";
            break;
        case "CLASSIFICADO":
            corCarimbo = "#1c3b7a"; 
            rotacao = "-5deg";
            break;
        case "SUSPEITO":
            corCarimbo = "#85581A"; 
            rotacao = "-2deg";
            break;
        case "EXPURGADO":
            corCarimbo = "#7a1c1c"; 
            rotacao = "-6deg";
            break;
        default:
            corCarimbo = "#7a1c1c";
    }

    // Posicionado no centro inferior (espaço livre antes da assinatura)
    return `
        <div style="text-align: center; margin: 25px 0 10px 0; position: relative; z-index: 5;">
            <div style="display: inline-block;" class="carimbo-efento-animado">
                <div style="border: 4px solid ${corCarimbo}; color: ${corCarimbo}; font-family: 'Cinzel', serif; font-size: 16pt; font-weight: bold; padding: 8px 22px; text-transform: uppercase; letter-spacing: 3px; text-shadow: 1px 1px 2px rgba(0,0,0,0.15); box-shadow: inset 0 0 0 2px ${corCarimbo}; background-color: rgba(251,247,235,0.85); transform: rotate(${rotacao}); transform-origin: center;">
                    ${status}
                </div>
            </div>
        </div>
    `;
}

function prepareTable() {
    prepararEstilosCarimbos();

    const statusInquisitorial = getVal('StatusInquisitorial');
    const htmlCarimboStatus = obterHtmlCarimboStatus(statusInquisitorial);

    // Pergaminho estruturado com fluxo limpo
    let html = `<div style="background-color: #fbf7eb; color: #2b2218; padding: 30px; font-family: 'Georgia', serif; width: 740px; box-sizing: border-box; margin: 0 auto; border: 4px double #5c3a21; position: relative;">`;
    
    html += `<div style="text-align:center; border-bottom: 2px solid #5c3a21; padding-bottom: 12px; margin-bottom: 20px;">`;
    html += `<span style="font-size:9pt; text-transform:uppercase; letter-spacing:3px; color:#5c3a21;">Tribunal de Controle Arcano — Organização Clave</span>`;
    html += `<h2 style="margin: 8px 0; font-size:16pt; color:#2b2218; letter-spacing: 1px;">REGISTRO INQUISITORIAL DE ARCANO</h2>`;
    html += `<p style="margin: 0; font-size:9pt; font-style:italic; color:#7a6e5d;">"Não deve existir magia fora da Clave"</p>`;
    html += `</div>`;

    if (avatarBase64) {
        html += `<div style="text-align:center; margin-bottom:20px;"><img src="${avatarBase64}" style="width:100px; height:100px; object-fit:cover; border:2px solid #5c3a21; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"></div>`;
    }
    
    html += `<table style="width: 100%; border-collapse: collapse; font-size: 10pt;">`;
    schema.forEach(s => {
        html += `<tr><td colspan="2" style="background-color: #e6d5b8; color: #2b2218; font-weight: bold; padding: 8px 10px; border-top: 1px solid #5c3a21; border-bottom: 1px solid #5c3a21; text-transform: uppercase; letter-spacing: 1px; font-size: 9.5pt;">${s.title}</td></tr>`;
        s.fields.forEach(f => {
            const nomeAmigavel = formatarNomeCampo(f);
            html += `<tr><td style="width: 35%; font-weight: bold; padding: 6px 10px; border-bottom: 1px dashed #d1c2a5; color: #4a3b2c;">${nomeAmigavel}:</td><td style="padding: 6px 10px; border-bottom: 1px dashed #d1c2a5; color: #2b2218;">${getVal(f)}</td></tr>`;
        });
    });
    html += `</table>`;

    // Inserção do Carimbo de Status no Centro Inferior (espaço livre)
    html += htmlCarimboStatus;
    
    const inquisidorAssinou = getVal('InquisidorAssinatura');
    const dataInquisitorial = getVal('DataInquisitorial');

    html += `
        <div style="margin-top: 25px; border-top: 2px solid #5c3a21; padding-top: 15px; display: flex; justify-content: space-between; align-items: flex-end; font-family: 'Georgia', serif; font-size: 10pt; color: #2b2218;">
            <div>
                <strong>Data Inquisitorial:</strong> ${dataInquisitorial}<br>
                <strong>Estatuto Atual:</strong> ${statusInquisitorial}
            </div>
            <div style="text-align: right; position: relative; min-height: 50px;">
                <div class="carimbo-efento-animado" style="font-family: 'Great Vibes', 'Brush Script MT', cursive; font-size: 26pt; color: #7a1c1c; margin-bottom: -12px; padding-right: 15px; text-shadow: 1px 1px 2px rgba(122, 28, 28, 0.3); transform-origin: center;">
                    ${inquisidorAssinou}
                </div>
                <div style="font-size: 8.5pt; border-top: 1px solid #5c3a21; padding-top: 4px; min-width: 200px;">
                    <strong>Inquisidor Responsável</strong>
                </div>
            </div>
        </div>
    `;
    
    html += `</div>`;

    const exportArea = document.getElementById('export-area');
    if (exportArea) {
        exportArea.innerHTML = html;
    }
}

function doExport(type) {
    const popup = document.getElementById('export-options-popup');
    if (popup) popup.style.display = 'none';

    executarExportacaoReal(type);
}

async function executarExportacaoReal(type) {
    prepareTable();
    const area = document.getElementById('export-area');
    const nomeChar = getVal('Nome') !== "---" ? getVal('Nome') : "Registrando";

    if (!area) {
        alert("Área de exportação não encontrada nos registros.");
        return;
    }

    if (type === 'png' || type === 'pdf') {
        area.style.display = 'block';
        area.style.position = 'absolute';
        area.style.left = '-9999px';
        area.style.top = '0';

        try {
            const canvas = await html2canvas(area, { 
                scale: 2, 
                useCORS: true,
                windowWidth: 800,
                backgroundColor: "#fbf7eb"
            });

            area.style.display = 'none';
            area.style.position = 'static';

            const imgData = canvas.toDataURL('image/png');

            if (type === 'png') {
                const link = document.createElement('a');
                link.download = `Clave_Registro_${nomeChar}.png`;
                link.href = imgData;
                link.click();
            } else {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pWidth = pdf.internal.pageSize.getWidth();
                const pHeight = pdf.internal.pageSize.getHeight();
                
                const imgWidth = pWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                let finalHeight = imgHeight;
                let finalWidth = imgWidth;
                
                if (imgHeight > pHeight) {
                    finalHeight = pHeight - 10;
                    finalWidth = (canvas.width * finalHeight) / canvas.height;
                }

                const xOffset = (pWidth - finalWidth) / 2;
                pdf.addImage(imgData, 'PNG', xOffset, 5, finalWidth, finalHeight);
                pdf.save(`Clave_Registro_${nomeChar}.pdf`);
            }
        } catch (error) {
            area.style.display = 'none';
            area.style.position = 'static';
            console.error("Erro na exportação gráfica:", error);
            alert("Erro ao gerar o arquivo gráfico do pergaminho.");
        }
    } else if (type === 'docx') {
        try {
            const docxLib = window.docx;
            const rows = [];
            
            rows.push(new docxLib.TableRow({
                children: [ new docxLib.TableCell({ 
                    children: [
                        new docxLib.Paragraph({ text: "ORGANIZAÇÃO CLAVE — REGISTRO INQUISITORIAL", bold: true, alignment: docxLib.AlignmentType.CENTER }),
                        new docxLib.Paragraph({ text: '"Não deve existir magia fora da Clave"', italics: true, alignment: docxLib.AlignmentType.CENTER })
                    ],
                    shading: { fill: "D6C5A8" }, columnSpan: 2 
                })]
            }));

            schema.forEach(s => {
                rows.push(new docxLib.TableRow({
                    children: [ new docxLib.TableCell({ 
                        children: [new docxLib.Paragraph({ text: s.title.toUpperCase(), bold: true })],
                        shading: { fill: "E6D5B8" }, columnSpan: 2 
                    })]
                }));
                s.fields.forEach(f => {
                    const nomeAmigavel = formatarNomeCampo(f);
                    rows.push(new docxLib.TableRow({
                        children: [
                            new docxLib.TableCell({ children: [new docxLib.Paragraph({ text: nomeAmigavel + ":", bold: true })], width: { size: 35, type: docxLib.WidthType.PERCENTAGE } }),
                            new docxLib.TableCell({ children: [new docxLib.Paragraph(getVal(f))], width: { size: 65, type: docxLib.WidthType.PERCENTAGE } })
                        ]
                    }));
                });
            });

            // Linha destacada para o Estatuto/Carimbo no documento Word
            rows.push(new docxLib.TableRow({
                children: [
                    new docxLib.TableCell({ 
                        children: [new docxLib.Paragraph({ text: `ESTATUTO INQUISITORIAL: ${getVal('StatusInquisitorial')}`, bold: true, alignment: docxLib.AlignmentType.CENTER })],
                        shading: { fill: "E6D5B8" }, columnSpan: 2 
                    })
                ]
            }));

            rows.push(new docxLib.TableRow({
                children: [
                    new docxLib.TableCell({ 
                        children: [
                            new docxLib.Paragraph({ text: `Data Inquisitorial: ${getVal('DataInquisitorial')}`, bold: true })
                        ],
                        width: { size: 50, type: docxLib.WidthType.PERCENTAGE },
                        shading: { fill: "F4ECDF" }
                    }),
                    new docxLib.TableCell({ 
                        children: [
                            new docxLib.Paragraph({ text: getVal('InquisidorAssinatura'), italics: true, alignment: docxLib.AlignmentType.RIGHT }),
                            new docxLib.Paragraph({ text: "Inquisidor Responsável", bold: true, alignment: docxLib.AlignmentType.RIGHT })
                        ],
                        width: { size: 50, type: docxLib.WidthType.PERCENTAGE },
                        shading: { fill: "F4ECDF" }
                    })
                ]
            }));

            const doc = new docxLib.Document({
                sections: [{ children: [ new docxLib.Table({ rows: rows, width: { size: 100, type: docxLib.WidthType.PERCENTAGE } }) ] }]
            });

            docxLib.Packer.toBlob(doc).then(blob => {
                saveAs(blob, `Clave_Registro_${nomeChar}.docx`);
            });
        } catch (err) {
            alert("Erro ao processar o pergaminho digital.");
            console.error(err);
        }
    }
}

function exportarDossieJSON() {
    const saved = localStorage.getItem('clave_registro_medieval');
    if (!saved) {
        alert("Nenhum registro encontrado para exportar.");
        return;
    }
    const blob = new Blob([saved], { type: "application/json;charset=utf-8" });
    const nomeChar = getVal('Nome') !== "---" ? getVal('Nome') : "Registrando";
    saveAs(blob, `Dossie_Clave_${nomeChar}.json`);
}

function importarDossie(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            JSON.parse(content);
            localStorage.setItem('clave_registro_medieval', content);
            loadData();
            alert("Dossiê carregado com sucesso dos arquivos da Clave!");
        } catch (err) {
            alert("Erro: O arquivo selecionado corrompeu os selos arcanos (JSON inválido).");
            console.error(err);
        }
    };
    reader.readAsText(file, "UTF-8");
    event.target.value = "";
}

function atualizarSistemaPericias() {
    if (typeof catalogoPericias === 'undefined') return;

    const p1 = document.getElementById('Pericia1')?.value;
    const p2 = document.getElementById('Pericia2')?.value;
    const p3 = document.getElementById('Pericia3')?.value;

    const selecionadas = [p1, p2, p3].filter(Boolean);
    const contagemAtributos = { "Destreza": 0, "Carisma": 0, "Sabedoria": 0 };

    selecionadas.forEach(p => {
        const atributo = catalogoPericias[p];
        if (atributo) {
            contagemAtributos[atributo]++;
        }
    });

    let sinergiaAtiva = false;
    let textoAtributos = [];

    for (let attr in contagemAtributos) {
        if (contagemAtributos[attr] > 0) {
            textoAtributos.push(`<b>${attr}:</b> ${contagemAtributos[attr]} perícia(s)`);
        }
        if (contagemAtributos[attr] >= 2) {
            sinergiaAtiva = true;
        }
    }

    const feedbackBox = document.getElementById('pericias-feedback');
    if (feedbackBox) {
        if (selecionadas.length === 0) {
            feedbackBox.innerHTML = "Nenhuma perícia selecionada. Escolha até 3 especialidades para calcular a sinergia de Habilidade-Chave.";
        } else {
            let html = `<b>Resumo das Habilidades-Chave:</b><br>` + textoAtributos.join(" | ");
            if (sinergiaAtiva) {
                html += `<br><span style="color: #8b0000; font-weight: bold;">✦ Sinergia Ativa! Você possui 2+ perícias na mesma Habilidade-Chave (+2 no resultado final no Discord).</span>`;
            } else {
                html += `<br><span style="color: #5c3a21;">Nenhuma Habilidade-Chave atingiu 2 perícias ainda.</span>`;
            }
            feedbackBox.innerHTML = html;
        }
    }
}

function inicializarInquisidorAleatorio() {
    const select = document.getElementById('InquisidorAssinatura');
    const campoData = document.getElementById('DataInquisitorial');

    const saved = localStorage.getItem('clave_registro_medieval');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (select && data['InquisidorAssinatura']) {
                select.innerHTML = '';
                const opt = document.createElement('option');
                opt.value = data['InquisidorAssinatura'];
                opt.textContent = data['InquisidorAssinatura'];
                opt.selected = true;
                select.appendChild(opt);
                select.disabled = true;
                if (campoData) campoData.value = data['DataInquisitorial'] || "560 DGA";
                return;
            }
        } catch (e) {
            console.error("Erro ao verificar inquisidor salvo:", e);
        }
    }

    if (select) {
        select.innerHTML = '';
        listaInquisidoresClave.forEach(nome => {
            const opt = document.createElement('option');
            opt.value = nome;
            opt.textContent = nome;
            select.appendChild(opt);
        });

        const indiceAleatorio = Math.floor(Math.random() * listaInquisidoresClave.length);
        select.selectedIndex = indiceAleatorio;
        select.disabled = true;
    }

    if (campoData && !campoData.value) {
        campoData.value = "560 DGA";
    }

    saveData();
}

window.addEventListener('DOMContentLoaded', () => {
    inicializarInquisidorAleatorio();
    loadData();
});

// Substitua ou insira este bloco no seu código JavaScript

document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'StatusInquisitorial') {
        saveData();
        prepareTable();
        dispararEfeitoCarimboVisual();
    }
});

function prepararEstilosCarimbos() {
    if (!document.getElementById('font-cursiva-inquisidor')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'font-cursiva-inquisidor';
        styleTag.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@700&display=swap');
            @keyframes carimboBatida {
                0% { transform: scale(3.5) rotate(-15deg); opacity: 0; filter: blur(4px); }
                50% { transform: scale(0.85) rotate(-2deg); opacity: 0.7; filter: blur(0px); }
                75% { transform: scale(1.1) rotate(3deg); opacity: 0.95; }
                100% { transform: scale(1) rotate(-4deg); opacity: 1; }
            }
            .carimbo-efento-animado {
                animation: carimboBatida 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
        `;
        document.head.appendChild(styleTag);
    }
}

function obterHtmlCarimboStatus(status) {
    if (!status || status === "---") return "";

    let corCarimbo = "#7a1c1c"; 
    let rotacao = "-4deg";

    switch(status.toUpperCase()) {
        case "VIGIADO":
            corCarimbo = "#1b4d3e"; 
            rotacao = "-3deg";
            break;
        case "CLASSIFICADO":
            corCarimbo = "#1c3b7a"; 
            rotacao = "-5deg";
            break;
        case "SUSPEITO":
            corCarimbo = "#85581A"; 
            rotacao = "-2deg";
            break;
        case "EXPURGADO":
            corCarimbo = "#7a1c1c"; 
            rotacao = "-6deg";
            break;
        default:
            corCarimbo = "#7a1c1c";
    }

    // ID único para permitir reiniciar a animação via JS
    return `
        <div style="text-align: center; margin: 25px 0 10px 0; position: relative; z-index: 5;">
            <div id="wrapper-carimbo-animado" style="display: inline-block;" class="carimbo-efento-animado">
                <div style="border: 4px solid ${corCarimbo}; color: ${corCarimbo}; font-family: 'Cinzel', serif; font-size: 16pt; font-weight: bold; padding: 8px 22px; text-transform: uppercase; letter-spacing: 3px; text-shadow: 1px 1px 2px rgba(0,0,0,0.15); box-shadow: inset 0 0 0 2px ${corCarimbo}; background-color: rgba(251,247,235,0.85); transform: rotate(${rotacao}); transform-origin: center;">
                    ${status}
                </div>
            </div>
        </div>
    `;
}

// Função que força o navegador a reiniciar a animação CSS do carimbo
function dispararEfeitoCarimboVisual() {
    const el = document.getElementById('wrapper-carimbo-animado');
    if (el) {
        el.classList.remove('carimbo-efento-animado');
        void el.offsetWidth; // Truque para reiniciar o fluxo de animação (reflow)
        el.classList.add('carimbo-efento-animado');
    }
}

/* ==========================================================
   INICIALIZAÇÃO DAS PARTÍCULAS E CURSOR MÁGICO (JS)
   ========================================================== */

window.addEventListener('DOMContentLoaded', () => {
    // 1. Cria o elemento de brilho do mouse
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });

    // 2. Cria o canvas de partículas de fundo multicoloridas
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const numParticles = 90; // Quantidade ideal para preencher sem pesar

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Paleta de cores arcanas mistas (Verdes, Dourados e Vermelhos)
    const paletaCores = [
        'rgba(27, 77, 62, 0.7)',   // Verde escuro Clave
        'rgba(46, 139, 87, 0.6)',  // Verde esmeralda
        'rgba(218, 165, 32, 0.7)', // Amarelo ouro
        'rgba(238, 232, 170, 0.5)',// Amarelo pálido / faísca
        'rgba(178, 34, 34, 0.6)',  // Vermelho rubi / brasa
        'rgba(220, 20, 60, 0.5)'   // Vermelho vivo suave
    ];

    // Inicializa as partículas com variedade de tamanhos e velocidades
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1.2,
            color: paletaCores[Math.floor(Math.random() * paletaCores.length)],
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: -Math.random() * 0.9 - 0.3,
            glowSize: Math.random() * 10 + 4
        });
    }

    // Loop de animação contínua das partículas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            // Recicla a partícula quando sai pelo topo
            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
            // Loop pelas laterais da tela
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = p.glowSize;
            ctx.shadowColor = p.color; // Brilho de acordo com a cor da partícula
            ctx.fill();
            ctx.closePath();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
