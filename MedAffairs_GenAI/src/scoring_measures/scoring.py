import pandas as pd
from utils import *
from config import *

docx_file1 = source_file_path
docx_file2 = "C:\\Users\\mmythri\\Documents\\GenAI\\MedAffairs_GenAI\\data\\output\\Abstract PLSAll_generated_document1690445147.docx"
source_text = read_docx(docx_file1)
target_text = read_docx(docx_file2)

cosine_similarity = calculate_cosine_similarity(source_text, target_text)
rouge1, rouge2, rougeL = calculate_rouge_score(source_text, target_text)
bleu_score1 = calculate_bleu_score(source_text, target_text, weights=[1.0, 0, 0, 0])
bleu_score2 = calculate_bleu_score(source_text, target_text, weights=[0, 1.0, 0, 0])
bleu_score3 = calculate_bleu_score(source_text, target_text, weights=[0, 0, 1.0, 0])

print("ROUGE-1: measures uni-grams ", rouge1)
print("ROUGE-2: measures bi-grams", rouge2)
print("ROUGE-L: measures Longest Common Subsequence (LCS) words", rougeL)
print("BLEU-1: measures uni-grams ", bleu_score1)
print("BLEU-2: measures bi-grams ", bleu_score2)
print("BLEU-3: measures tri-grams ", bleu_score3)
# Create a dictionary with sample data
score_data = {
    'document_type': [doc_type],
    'rouge_1': [rouge1],
    'rouge_2': [rouge2],
    'rouge_l': [rougeL],
    'bleu_1': [bleu_score1],
    'bleu_2': [bleu_score2],
    'bleu_3': [bleu_score3],
    'cosine_similarity': [cosine_similarity]
}

# Create a pandas DataFrame from the dictionary
score_df = pd.DataFrame(score_data)

def read_append_save_csv(score_file_path, data_to_append):
    """

    :param score_file_path: csv file to save to scores
    :param data_to_append: scores dataframe
    """

    # Check if the CSV file exists
    if os.path.isfile(score_file_path):
        # Read the existing CSV file into a DataFrame
        existing_data = pd.read_csv(score_file_path)

        # Append the new data to the existing DataFrame
        combined_data = existing_data.append(data_to_append, ignore_index=True)

    else:
        # If the CSV file doesn't exist, create a new DataFrame with the data to append
        combined_data = data_to_append
    # Save the combined data to the CSV file
    combined_data.to_csv(score_file_path, index=False)
    return 0


read_append_save_csv(scoring_data_path, score_df)
