from flask import Blueprint, render_template, request
from src.document_generation.document_generation import doc_generation

# Create another Blueprint instance for processing data
data_blueprint = Blueprint('data', __name__)


@data_blueprint.route('/process_data', methods=['GET', 'POST'])
def process_data():
    if request.method == 'POST':
        # Retrieve data from the form, if any
        data = request.form.get('data')
        # Call your existing Python function with the data
        result = doc_generation(data)
        # You can process the result further if needed
        # For example, convert it to a specific format or use it in a template
        return render_template('result.html', result=result)

    return render_template('form.html')
