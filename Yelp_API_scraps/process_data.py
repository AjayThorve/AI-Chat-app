#import pandas
import pandas as pd

#import all data
data = pd.read_csv('FILE_1.csv',header=0,index_col=0)

#extract 100 records which we would recommend
data_positive = data[(data.Rating>4.0) & (data.NumberOfReviews>300)].head(100)

#extract 100 records which we would not recommend
data_negative = data[(data.Rating<4.0) & (data.NumberOfReviews>300)].head(100)

#filter the total data and clear the data_positive and data_negative rows to avoid repitition
data_file1 = data[~data.index.isin(data_positive.index)]
data_file1 = data_file1[~data_file1.index.isin(data_negative.index)]

#add recommendation column
data_positive['Recommended'] = 1
data_negative['Recommended'] = 0
#create file2
data_file2 = pd.concat([data_positive,data_negative])

# convert to csv
data_file1.to_csv('FILE_1.csv', encoding='utf-8')
data_file2.to_csv('FILE_2.csv', encoding='utf-8')