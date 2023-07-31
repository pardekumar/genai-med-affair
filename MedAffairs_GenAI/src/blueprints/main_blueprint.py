from flask import Blueprint

# Create a new Blueprint instance
main_blueprint = Blueprint('main', __name__)


# Define the route for the homepage using the Blueprint
@main_blueprint.route('/')
def home():
    return 'Welcome to the Flask Web App!'
