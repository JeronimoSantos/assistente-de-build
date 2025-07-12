//
const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const form = document.getElementById('form');
const aiResponse = document.getElementById('aiResponse');
const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

//
// chave api AIzaSyAA3NO-8LEgMvtTd2eIdcLjQiTrrrwBK5w
const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
        ## Especilidade
        Você é um especialista de meta para o jogo ${game}.
        ## Tarefa
        Você deve responder as perguntas com base no seu conhecimento do jogo, estratégias, builds e dicas.
        ## Regras
        - Se você não sabe a resposta, responda com "Não sei" e não tente invetar uma resposta.
        - Se a pergunta não estiver relacionada ao jogo, responda com "Essa pergunta não tem relação com o jogo".
        - Considere a data atual ${new Date().toLocaleDateString('pt-BR')}.
        - Faça perquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que você não tenha certeza de que existem no patch atual.
        ## Resposta
        - Economiza na resposta, seja direto e responda no máximo 600 caracteres.
        - Responda em markdown.
        - Não preciza fazer saudação ou despedida, apenas responda que o usuário está querendo.
        ## Exemplo de resposta
        - Pergunta do usuário: Build para ranqueada css com kely
        - Resposta: A build mais atual é: \n\n **personagems:** \n\n **pets:** \n\n **armas** \n\n

        ----
        - Resposta para o usuário: ${question}.
    `
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }];

    const tools = [{
        google_search: {}
    }]

// CHAMADA API
const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        contents,
        tools
    })
});

    const data = await response.json()
    return data.candidates[0].content.parts[0].text;
}
//
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if(apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos.')
        return;
    }

//
    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add('loading');

//
    try {
       const text = await perguntarAI(question, game, apiKey);
       aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text);
       aiResponse.classList.remove('hidden');
    } catch(error) {
        console.log("Erro:", error);
    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('loading');
    }

});

