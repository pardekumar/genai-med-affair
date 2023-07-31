import os
import time
# parameters that can be changed
model = 'gpt-3.5-turbo'
tokenizer_model = "gpt-3.5-turbo"
dir_name = os.path.dirname(__file__)

max_tokens = 1500
chain_type = 'map_reduce'
OPENAI_API_KEY = "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"

doc_type = "Manuscript" # Abstract, Manuscript, AbstractPLS, Poster, nejm
if doc_type in ["Manuscript", "Abstract", "Abstract PLS"]:
    file = "P-Reality OS Extended Follow-Up_PPO pre-review_ Discussion Guide_10JAN22 (PAL1144).docx"
    pdf_file = "P-Reality OS Extended Follow-Up_PPO pre-review_ Discussion Guide_10JAN22 (PAL1144).pdf"
else:
    file = "P-Reality-X Manuscript_Draft 1_17Feb22 (PAL1144).docx"
    pdf_file = "P-Reality-X Manuscript_Draft 1_17Feb22 (PAL1144).pdf"

#"P-Reality-X Manuscript_Draft 1_17Feb22 (PAL1144).docx"
pdf_file = "P-Reality OS Extended Follow-Up_PPO pre-review_ Discussion Guide_10JAN22 (PAL1144).pdf"
file_path = os.path.join(dir_name+'\\data\\input\\'+file)
print(file_path)
pdf_file_path = os.path.join(dir_name + '\\data\\input\\'+pdf_file)
source_file = "AbstractPLSHumanGenerated.docx"
source_file_path = os.path.join(dir_name+'\\data\\input\\'+source_file)

doc_components = ["Abstract", "Background", "Methods", "Results", "Discussion",
                  "Conclusions", "Acknowledgements", "References", "Tables", "Figures"]


instructions_list = [
    """Guideline 1: Except for units of measurement, identify any abbreviations in the text, 
        the first time an abbreviation appears, it should be preceded by the words for which it stands.""",
    """Guideline 2: Express all measurements in conventional units, with Système International (SI) 
        units given in parentheses throughout the text.""",
    """Guideline 3: Generic names should be used for any drugs. In case of proprietary brands, include
        brand name and the name of the manufacturer in parentheses after the first mention of generic name."""
]

restyled_manuscript = os.path.join(dir_name+'\\data\\output\\journal_restyled.docx')

section_list = "Results"

excel_file = os.path.join(dir_name+'\\data\\input\\prompt_all_in_one.xlsx')

generated_document_path = os.path.join(dir_name+'\\data\\output\\'+doc_type + section_list
                                       +str(int(time.time()))+'.docx')

scoring_data_path = os.path.join(dir_name+'\\data\\output\\'+doc_type+'_scores.csv')

mapping_excel = os.path.join(dir_name+'\\data\\input\\Source_Target_Section_Mapping.xlsx')