from flask import Flask
from src.blueprints.main_blueprint import main_blueprint
from blueprints.data_blueprint import data_blueprint
from src.prompt.index import prompt_blueprint

app = Flask(__name__)

# Register the Blueprints
app.register_blueprint(main_blueprint)
app.register_blueprint(data_blueprint)
app.register_blueprint(prompt_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
