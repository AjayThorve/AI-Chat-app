import boto3
import os.path

s3 = boto3.client('s3')
filepath = 'FILE_1.csv'
file = 'FILE_1.csv'
bucket_name = 'elasticbeanstalk-us-east-1-878823813267'
if os.path.isfile(filepath):
    s3.upload_file(filepath,bucket_name,file)
    print("successfully saved FILE_2.csv to aws s3")
    
filepath = 'FILE_2.csv'
file = 'FILE_2.csv'
if os.path.isfile(filepath):
    s3.upload_file(filepath,bucket_name,file)
    print("successfully saved FILE_2.csv to aws s3")