MedAffairs GenAI project
# uses python 3.8 or above
Input documents are to be placed in data/input folder
Output generated documents will be saved in data/output folder

#TODO
should update requirements.txt
should add scoring component

To run document generation for any document type -
Place prompt file in input folder and change the document_type in config.py


need to add function that converts pdf to docx, or docx to pdf
need to modify cosine similarity calculation fn, doesn't work with long texts 