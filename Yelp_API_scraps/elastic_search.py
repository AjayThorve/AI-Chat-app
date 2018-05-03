import boto3
from aws_requests_auth.aws_auth import AWSRequestsAuth
from elasticsearch import Elasticsearch, RequestsHttpConnection

session = boto3.session.Session()
credentials = session.get_credentials().get_frozen_credentials()

es_host = 'search-aat414-74g35x3ff5baw4ct7midgbdb7i.us-east-1.es.amazonaws.com'
awsauth = AWSRequestsAuth(
    aws_access_key=credentials.access_key,
    aws_secret_access_key=credentials.secret_key,
    aws_token=credentials.token,
    aws_host=es_host,
    aws_region=session.region_name,
    aws_service='es'
)

# use the requests connection_class and pass in our custom auth class
es = Elasticsearch(
    hosts=[{'host': es_host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection
)

res = {"Cuisine":"indian","Rating":5.0,"NumberOfReviews":143,"score":0.8113656}

# es.delete(index="predictions", doc_type="Prediction", id="_7BGw3YFNOTzP1Www3zB7g", body=res)
