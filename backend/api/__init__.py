from flask import Flask
from flask_cors import CORS
from flask_compress import Compress

from .handlers import main_api_blueprint



app = Flask("Gallery API")
CORS(app)
Compress(app)

app.register_blueprint(main_api_blueprint)