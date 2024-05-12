// Lidar com o clique no botão de upload
document.getElementById('arquivo').addEventListener('change', function (e) {
  const file = this.files[0];
  // Exibir o GIF de carregamento
  document.getElementById('loading-gif').style.display = 'inline';
  // Faça algo com o arquivo, como enviar para o servidor
  console.log('Arquivo selecionado:', file);
  enviarArquivo(file.name);
});

// Função para atualizar o texto do botão com o nome do arquivo
function updateButtonLabel(fileName) {
  const uploadBtn = document.querySelector('.upload-btn');
  uploadBtn.textContent = fileName;
}

function enviarArquivo(fileName) {
  const arquivoInput = document.getElementById('arquivo');
  const arquivo = arquivoInput.files[0];
  let temperature = document.querySelector('.inputTemperature').value;
  let api_key = document.querySelector('.APIKey').value;
  let harassment = document.querySelector('.inputAssedio').value;
  let hate = document.querySelector('.inputOdio').value;
  let sexually = document.querySelector('.inputSexual').value;
  let dangerous = document.querySelector('.inputPerigoso').value;

  console.log("api" + api_key)

  if (api_key != null && api_key != "") {
    updateButtonLabel(fileName);
    const formData = new FormData();
    formData.append('file', arquivo);
    formData.append('temperature', temperature);
    formData.append('api_key', api_key);
    formData.append('harassment', harassment);
    formData.append('hate', hate);
    formData.append('dangerous', dangerous);
    formData.append('sexually', sexually);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Retorna o corpo da resposta como JSON
        } else {
          console.error('Falha ao enviar arquivo.');
          document.getElementById('loading-gif').style.display = 'none';
          alert('Falha ao enviar arquivo.');
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
        document.getElementById('loading-gif').style.display = 'none';
        updateButtonLabel("Faça upload");
        alert(error);
      });
  } else {
    document.getElementById('loading-gif').style.display = 'none';
    alert("Chave API invalida...");
  }
}

function generateHTMLFromTopics(inputString, parentElement) {
  const data = JSON.parse(inputString); // Converte a string JSON para objeto JavaScript

  // Cria um elemento de lista não ordenada
  const listElement = document.createElement('ul');

  // Itera sobre cada chave no objeto JSON
  for (const key in data) {
    // Verifica se a chave é um tópico principal
    if (data.hasOwnProperty(key)) {
      const topicElement = document.createElement('li'); // Cria um novo item de lista para o tópico principal
      const strongElement = document.createElement('strong'); // Cria um elemento para texto em negrito
      strongElement.textContent = key; // Define o texto em negrito como o nome do tópico principal
      topicElement.classList.add('topic'); // Adiciona a classe desejada
      topicElement.appendChild(strongElement); // Adiciona o texto em negrito ao elemento do tópico
      listElement.appendChild(topicElement); // Adiciona o elemento do tópico à lista principal

      // Cria um elemento de lista não ordenada para as subseções do tópico principal
      const subListElement = document.createElement('ul');

      // Verifica se o valor correspondente à chave é um array
      if (Array.isArray(data[key])) {
        // Itera sobre cada elemento do array
        data[key].forEach((value) => {
          const subTopicElement = document.createElement('li'); // Cria um novo item de lista para a subseção
          subTopicElement.textContent = value; // Define o texto da subseção
          subTopicElement.classList.add('resposta');
          subListElement.appendChild(subTopicElement); // Adiciona a subseção à lista de subseções
        });
      } else if (typeof data[key] === 'string') {
        // Se for uma string, cria um único item de lista para a subseção
        const subTopicElement = document.createElement('li');
        subTopicElement.classList.add('resposta');
        const text = data[key].replace(/\n/g, '<br>');
        subTopicElement.textContent = text;
        subListElement.appendChild(subTopicElement);
      } //verificar se for outro chave valor

      topicElement.appendChild(subListElement); // Adiciona a lista de subseções ao tópico principal
    }
  }

  parentElement.appendChild(listElement); // Adiciona a lista principal ao elemento pai
  // Exibe o GIF de carregamento
  document.getElementById('loading-gif').style.display = 'none';
}




document.addEventListener('DOMContentLoaded', function () {
  const inputCarrinho = document.querySelector('.inputTemperature');
  const valorSpan = document.querySelector('.valorTemperature');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function () {
    valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inputCarrinho = document.querySelector('.inputAssedio');
  const valorSpan = document.querySelector('.valorAssedio');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function () {
    valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inputCarrinho = document.querySelector('.inputOdio');
  const valorSpan = document.querySelector('.valorOdio');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function () {
    valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inputCarrinho = document.querySelector('.inputSexual');
  const valorSpan = document.querySelector('.valorSexual');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function () {
    valorSpan.textContent = inputCarrinho.value;
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inputCarrinho = document.querySelector('.inputPerigoso');
  const valorSpan = document.querySelector('.valorPerigoso');

  // Atualiza o valor exibido ao lado do controle de entrada
  inputCarrinho.addEventListener('input', function () {
    valorSpan.textContent = inputCarrinho.value;
  });
});

document.getElementById("imgSeta").addEventListener("click", function () {
  var maisConfigs = document.getElementById("maisConfigs");
  if (maisConfigs.style.display === "none") {
    maisConfigs.style.display = "block";
  } else {
    maisConfigs.style.display = "none";
  }
});