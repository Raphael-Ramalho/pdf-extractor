# -*- coding: utf-8 -*-
 
from flask import Flask, jsonify, request
from flask_cors import CORS
import tabula

config = {"DEBUG": True}

# ROTA
app = Flask(__name__)
CORS(app) 

app.config.from_mapping(config)

@app.route('/server', methods = ['POST'])
def output():
    if request.method == 'POST':
        if 'file' not in request.files:
            print('No file part')
            return ("NOT FOUND", 404)
        else:
            file = request.files['file']            
            tabela = tabula.read_pdf(file, stream=True, pages='all', output_format="json", encoding='UTF-8', java_options="-Dfile.encoding=UTF8")
            response = jsonify(tabela)
            return response 

if __name__ == '__main__':
    app.run('0.0.0.0', '8080')





