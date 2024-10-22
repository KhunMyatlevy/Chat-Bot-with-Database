from django.db import models

class ChatHistory(models.Model):
    user_message = models.TextField()  # Field to store the user's input
    bot_response = models.TextField()  # Field to store the bot's response
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp to store when the conversation occurred

    def __str__(self):
        return f'User: {self.user_message[:50]} | Bot: {self.bot_response[:50]}'
