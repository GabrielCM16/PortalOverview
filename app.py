from flask import Flask, request, jsonify
import PyPDF2
import google.generativeai as genai
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    temperature = request.form['temperature']
    api_key = request.form['api_key']
    hate = request.form['hate']
    harassment = request.form['harassment']
    sexually = request.form['sexually']
    dangerous = request.form['dangerous']
    
    print('temperature',temperature)
    print('api_key',api_key)
    print('hate', hate)
    print('harassment', harassment)
    print('sexually', sexually)
    print('dangerous',dangerous)
    
    if uploaded_file:
        # Extrai texto do PDF
        print('processando')
        texto = extrair_texto_pdf(uploaded_file)
        gerado = gerarResponseGemini(texto, temperature, api_key, harassment, hate, sexually, dangerous)
        return jsonify({'resultado': gerado})  # Retorna a resposta em formato JSON
    else: return jsonify({'erro': 'Arquivo não recebido'})  # Retorna um erro em formato JSON


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


def gerarResponseGemini(textPDF, input_temperature, api_key, harassment, hate, sexually, dangerous):
    genai.configure(api_key=api_key)
    
    temperature = int(input_temperature) / 10 if int(input_temperature) > 0 else int(input_temperature)
    # Set up the model
    generation_config = {
    "temperature": temperature,
    "top_p": 1,
    "top_k": 0,
    "max_output_tokens": 2048,
    "response_mime_type": "application/json",
    }
    
    thresholds = [
        "BLOCK_NONE",
        "BLOCK_ONLY_HIGH",
        "BLOCK_MEDIUM_AND_ABOVE",
        "BLOCK_LOW_AND_ABOVE"
    ]

    safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": (thresholds[int(harassment)])
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": (thresholds[int(hate)])
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": (thresholds[int(sexually)])
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": (thresholds[int(dangerous)])
    },
    ]

    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                                generation_config=generation_config,
                                safety_settings=safety_settings)

    chat = model.start_chat(history=[])

    # Envie o texto para o Gemini
    print("enviando para o gemini")
    
    prompt = f"Em português do Brasil, analise cuidadosamente o texto. Identifique seus pontos e tópicos principais. Não é necessário abordar todos. Em seguida, faça um resumo não tão curto. Retrate bem os resultados obtidos e principalmente a motivação ou a fundamentação teórica do texto, seus autores e outras informações que você achar importante. Apresente em tópicos, garantindo que não haja perda de dados ou quantidade de tópicos principais. \n\n{textPDF}"
    response = chat.send_message(prompt)
    print("Response: ", response.text)

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


