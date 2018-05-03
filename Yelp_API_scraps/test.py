from elastic_search import es
import pandas as pd
import json

data = pd.read_csv("data/FILE_3.csv",index_col="RestrauntID")
data_positive = data[data["bestAnswer"]==1]
cols_to_remove = ['Rating','NumberOfReviews','bestAnswer']
data_final = data_positive.drop(cols_to_remove,axis=1)

for index, row in data_final.iterrows():
    document = dict(row)
    es.index(index="predictions", doc_type="Prediction", id=index, body=document)
    print(".",end="")

# print(es.get(index="predictions", doc_type="Prediction", id="_7BGw3YFNOTzP1Www3zB7g"))