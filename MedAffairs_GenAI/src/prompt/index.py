from flask import Blueprint
import pandas as pd

# Create a new Blueprint instance
prompt_blueprint = Blueprint('prompt', __name__)

_ekeys = ['Document Type', 'question', 'section', 'words']


@prompt_blueprint.route("/prompt", methods=['GET'])
def get_prompt():
    keys = _ekeys
    retdata = {"data": {}}
    df = pd.read_excel('../data/prompt/prompt.xlsx')
    df_keys = df.columns.values.tolist()
    for key in keys:
        if key not in df_keys:
            return "\"{0}\" key not found in excel.".format(key)

    for index, row in df.iterrows():
        print(row[keys[0]], row[keys[1]])
        retdata["data"] = set_doc_type(retdata["data"], row)

    return retdata


def set_doc_type(retdata, row):
    keys = _ekeys
    retdata = set_init(retdata)
    if (row[keys[0]] in retdata["items"]):
        retdata["data"][row[keys[0]]] = set_question(
            retdata["data"][row[keys[0]]], row)
    else:
        retdata["items"].append(row[keys[0]])
        retdata["data"][row[keys[0]]] = {}
        retdata["data"][row[keys[0]]] = set_question(
            retdata["data"][row[keys[0]]], row)
    return retdata


def set_question(retdata, row):
    keys = _ekeys
    retdata = set_init(retdata)
    if (row[keys[1]] in retdata["items"]):
        retdata["data"][row[keys[1]]] = set_section(
            retdata["data"][row[keys[1]]], row)
    else:
        retdata["items"].append(row[keys[1]])
        retdata["data"][row[keys[1]]] = {}
        retdata["data"][row[keys[1]]] = set_section(
            retdata["data"][row[keys[1]]], row)
    return retdata


def set_section(retdata, row):
    keys = _ekeys
    retdata = set_init(retdata)
    if (row[keys[2]] in retdata["items"]):
        retdata["data"][row[keys[2]]] = set_word(
            retdata["data"][row[keys[2]]], row)
    else:
        retdata["items"].append(row[keys[2]])
        retdata["data"][row[keys[2]]] = {}
        retdata["data"][row[keys[2]]] = set_word(
            retdata["data"][row[keys[2]]], row)
    return retdata


def set_word(retdata, row):
    keys = _ekeys
    retdata = set_init(retdata)
    if (row[keys[3]] not in retdata["items"]):
        retdata["items"].append(row[keys[3]])
    return retdata


def set_init(retdata):
    if "items" not in retdata:
        retdata['items'] = []
        retdata['data'] = {}
    return retdata
