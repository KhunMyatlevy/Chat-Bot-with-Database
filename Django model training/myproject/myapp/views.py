from django.shortcuts import render

def chat(request):
    return render(request, 'myapp/chat.html')

from django.shortcuts import render
import requests
from .models import ChatHistory

def chat_gpt(request):
    bot_response = None  # Initialize bot_response to None

    if request.method == "POST":
        # Retrieve the user message
        user_message = request.POST.get('message')

        # Define API URL and payload for ChatGPT
        url = "https://chat-gpt26.p.rapidapi.com/"
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        }
        headers = {
            "x-rapidapi-key": "1588b733eemsh7e1c6cfd87b741bp1a034djsn36f1068b8f8d",
            "x-rapidapi-host": "chat-gpt26.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        # Send POST request to API
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()

        # Extract ChatGPT response
        bot_response = data['choices'][0]['message']['content']

        # Save the user input and bot response to the database
        chat = ChatHistory(user_message=user_message, bot_response=bot_response)
        chat.save()  # This saves the record to the database

    # Retrieve all chat history from the database
    chats = ChatHistory.objects.all()

    # Pass the bot response and chat history to the template
    return render(request, 'myapp/chat.html', {'response': bot_response, 'chats': chats})
