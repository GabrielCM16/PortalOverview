// Lidar com o clique no botão de upload
document.getElementById('arquivo').addEventListener('change', function (e) {
    const file = this.files[0];
    // Exibir o GIF de carregamento
    document.getElementById('loading-gif').style.display = 'inline';
    // Faça algo com o arquivo, como enviar para o servidor
    console.log('Arquivo selecionado:', file);
    enviarArquivo();
    updateButtonLabel(file.name);
  });

  // Função para atualizar o texto do botão com o nome do arquivo
  function updateButtonLabel(fileName) {
    const uploadBtn = document.querySelector('.upload-btn');
    uploadBtn.textContent = fileName;
  }

  function enviarArquivo() {
    const arquivoInput = document.getElementById('arquivo');
    const arquivo = arquivoInput.files[0];
    let temperature = document.querySelector('.inputTemperature').value;

    const formData = new FormData();
    formData.append('file', arquivo);
    formData.append('temperature', temperature);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Retorna o corpo da resposta como JSON
        } else {
          console.error('Falha ao enviar arquivo.');
          throw new Error('Erro ao enviar arquivo');
        }
      })
      .then(data => {
        console.log('Resposta recebida:', data.resultado); // Aqui você tem acesso à resposta do servidor
        const res = data.resultado.toString();
        generateHTMLFromTopics(res, document.getElementById('topics'));
      })
      .catch(error => {
        console.error('Erro:', error);
      });

  }

  function generateHTMLFromTopics(inputString, parentElement) {
    const lines = inputString.split('\n'); // Divide a string em linhas
    const listElement = document.createElement('ul');

    let currentParent = listElement; // Inicializa o elemento pai como a lista principal
    let isPreviousMainTopic = false; // Flag para verificar se o tópico anterior era um tópico principal

    for (const line of lines) {
        // Remove espaços extras no início e no final da linha
        const trimmedLine = line.trim();

        // Verifica se a linha não está vazia
        if (trimmedLine.length > 0) {
            // Verifica se é um tópico principal
            if (trimmedLine.startsWith('***')) {
                const topicElement = document.createElement('ul');
                const strongElement = document.createElement('strong'); // Cria elemento para negrito
                strongElement.textContent = trimmedLine.replace(/\*|\*{2,3}/g, ''); // Remove os marcadores de tópico e adiciona texto em negrito
                topicElement.classList.add('topic'); // Adiciona a classe desejada
                topicElement.appendChild(strongElement);
                listElement.appendChild(topicElement);
                currentParent = topicElement; // Define o elemento pai como o tópico atual
                isPreviousMainTopic = true; // Atualiza a flag para indicar que o tópico atual é um tópico principal
            }
            // Caso contrário, é uma resposta
            else {
                const responseElement = document.createElement('li'); // Cria um novo item de lista para a resposta
                responseElement.innerHTML = trimmedLine.replace(/\*|\*{2,3}/g, ''); // Remove os marcadores de resposta e adiciona HTML
                responseElement.classList.add('resposta'); // Adiciona a classe desejada
                currentParent.appendChild(responseElement);
            }
        }
    }

    parentElement.appendChild(listElement);
    // Exibir o GIF de carregamento
    document.getElementById('loading-gif').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', function() {
  const inputCarrinho = document.querySelector('.inputTemperature');
  const valorSpan = document.querySelector('.valorTemperature');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function() {
      valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const inputCarrinho = document.querySelector('.inputAssedio');
  const valorSpan = document.querySelector('.valorAssedio');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function() {
      valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const inputCarrinho = document.querySelector('.inputOdio');
  const valorSpan = document.querySelector('.valorOdio');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function() {
      valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const inputCarrinho = document.querySelector('.inputSexual');
  const valorSpan = document.querySelector('.valorSexual');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function() {
      valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const inputCarrinho = document.querySelector('.inputPerigoso');
  const valorSpan = document.querySelector('.valorPerigoso');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function() {
      valorSpan.textContent = inputCarrinho.value;
  });
});

document.getElementById("imgSeta").addEventListener("click", function() {
  var maisConfigs = document.getElementById("maisConfigs");
  if (maisConfigs.style.display === "none") {
    maisConfigs.style.display = "block";
  } else {
    maisConfigs.style.display = "none";
  }
});