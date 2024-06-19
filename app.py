from flask_restx import Namespace, Resource
from flask import Flask, request
from flask_restx import Api
from flask_cors import CORS, cross_origin

from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer


from Twitter_Sentiment_Analysis import classifyTwitterText


from canned_responses import generate_canned_response, get_sample_inputs

app = Flask(__name__)
CORS(app, origins='*') 
api = Api(app, version='1.0', title='My Flask API',
          description='A simple demonstration of a Flask-RESTx powered API')

# Initialize ChatterBot
chatbot = ChatBot('MyChatBot')
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train("chatterbot.corpus.english")

test_ns = Namespace('test', description='Test endpoint')
test_tweet_ns = Namespace('test_tweet', description='Test tweet endpoint')
# Namespace for chatbot
chatbot_ns = api.namespace('chatbot', description='Chatbot operations')


api.add_namespace(test_ns)
api.add_namespace(test_tweet_ns)


@test_ns.route('/')
class Test(Resource):
    def post(self):
        return {'message': 'Test endpoint POST'}

@test_tweet_ns.route('/')
class TestTweet(Resource):
    def post(self):
        return {'message': 'Test tweet endpoint POST'}
        
        
@chatbot_ns.route('/ask')
class ChatBotAsk(Resource):
    def post(self):
        json_data = request.json
        user_input = json_data.get('message')
        print(user_input)
        #response = chatbot.get_response(user_input)
        #print(response)
        sentiment = classifyTwitterText(user_input)
        response = generate_canned_response(user_input)
        return {'response': response, 'sentiment': sentiment}

@chatbot_ns.route('/inputs')
class ChatBotInputs(Resource):
    def post(self):
        response = get_sample_inputs()
        return {'response': response}
        
        
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)