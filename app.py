from flask import Flask, request, jsonify
import PyPDF2
import google.generativeai as genai
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    temperature = request.form['temperature']
    print('temperature',temperature)
    if uploaded_file:
        # Extrai texto do PDF
        print('processando')
        texto = extrair_texto_pdf(uploaded_file)
        gerado = gerarResponseGemini(texto, temperature)
        return jsonify({'resultado': gerado})  # Retorna a resposta em formato JSON
    else: return jsonify({'erro': 'Arquivo não recebido'})  # Retorna um erro em formato JSON


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


def gerarResponseGemini(textPDF, input_temperature):
    genai.configure(api_key="")
    
    temperature = int(input_temperature) / 10 if int(input_temperature) > 0 else int(input_temperature)
    # Set up the model
    generation_config = {
    "temperature": temperature,
    "top_p": 1,
    "top_k": 0,
    "max_output_tokens": 2048,
    }

    safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    ]

    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                                generation_config=generation_config,
                                safety_settings=safety_settings)

    chat = model.start_chat(history=[])

    # Envie o texto para o Gemini
    print("enviando para o gemini")
    
    prompt = f"Em português do Brasil, analise cuidadosamente o texto. Identifique seus pontos e tópicos principais. Não é necessário abordar todos. Em seguida, faça um resumo não tão curto. Retrate bem os resultados obtidos e principalmente a motivação ou a fundamentação teórica do texto, seus autores e outras informações que você achar importante. Apresente em tópicos, garantindo que não haja perda de dados ou quantidade de tópicos principais. Faça a resposta em formato de topicos onde um topico principal é entre ***nome do Topico*** e a resposta do topico é *resposta* esses sao apenas exemplos coloque os nomes certos dos topicos \n\n{textPDF}"
    response = chat.send_message(prompt)
    print("Response: ", response.text)
    
    # Dividindo a string em linhas
    linhas = (response.text).splitlines()

    # Removendo a primeira e última linha
    linhas_sem_primeira_ultima = linhas[1:-1]

    # Juntando as linhas novamente em uma única string
    texto_sem_primeira_ultima = '\n'.join(linhas_sem_primeira_ultima)

    print("\n texto sem a ", texto_sem_primeira_ultima)

    return response.text


def extrair_texto_pdf(uploaded_file):
    """Extrai o texto de um arquivo PDF."""
    # Cria um objeto BytesIO com os dados do arquivo
    arquivo_bytes = io.BytesIO(uploaded_file.read())

    # Cria um objeto PdfReader para ler o PDF
    leitor = PyPDF2.PdfReader(arquivo_bytes)
    num_paginas = len(leitor.pages)
    texto = ""
    for i in range(num_paginas):
        pagina = leitor.pages[i]
        texto += pagina.extract_text()
    return texto
if __name__ == '__main__':
    app.run(debug=True)


