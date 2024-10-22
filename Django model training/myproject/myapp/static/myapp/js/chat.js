const apiKey = "1588b733eemsh7e1c6cfd87b741bp1a034djsn36f1068b8f8d";  // Replace with your actual ChatGPT API key

// Function to handle sending a message
async function sendMessage() {
    // Get the user input from the input field in the HTML
    const userInput = document.getElementById('user-input').value;

    // If the input is empty, do nothing
    if (userInput === "") return;

    // Display the user's message in the chat box
    displayMessage("User", userInput);
    
    // Clear the input field after sending the message
    document.getElementById('user-input').value = "";

    // Prepare the API request to send user input to the ChatGPT API
    const url = "https://chat-gpt26.p.rapidapi.com/";  // ChatGPT API endpoint
    const options = {
        method: 'POST',  // Use the POST method to send data
        headers: {
            'content-type': 'application/json',  // The content is JSON
            'X-RapidAPI-Key': apiKey,  // Your RapidAPI key for authentication
            'X-RapidAPI-Host': 'chat-gpt26.p.rapidapi.com'  // The RapidAPI host
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",  // The ChatGPT model to use
            messages: [{ role: "user", content: userInput }]  // The user's input sent as a message
        })
    };

    try {
        // Send the request to the ChatGPT API and wait for the response
        const response = await fetch(url, options);
        if (response.ok) {
            // If the response is successful, parse the JSON response
            const data = await response.json();
            // Extract the GPT response from the API's response
            const gptResponse = data.choices[0].message.content;
            
            // Display ChatGPT's response in the chat box
            displayMessage("ChatGPT", gptResponse);

            // After receiving the response, save the user input and GPT response to the Django backend
            saveToDatabase(userInput, gptResponse);
        } else {
            // If the API response is not OK, display an error message
            displayMessage("ChatGPT", "Error: Could not get a response.");
        }
    } catch (error) {
        // If there is an error with the fetch request, display it
        displayMessage("ChatGPT", "Error: " + error.message);
    }
}

// Function to save the chat (user input and GPT response) to the Django backend
function saveToDatabase(userInput, gptResponse) {
    // Send a POST request to the Django backend to save the chat data
    fetch('/save-chat/', {
        method: 'POST',  // Use the POST method to send data
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',  // Data will be form-encoded
        },
        body: new URLSearchParams({
            'user_input': userInput,  // Include the user input in the request body
            'gpt_response': gptResponse  // Include the GPT response in the request body
        })
    })
    .then(response => response.json())  // Parse the response as JSON
    .then(data => {
        // If the response indicates success, log a success message
        if (data.status === 'success') {
            console.log('Chat saved successfully!');
        } else {
            // If there's an error, log the error message
            console.log('Error saving chat:', data.error);
        }
    })
    .catch(error => console.log('Error:', error));  // Catch and log any errors
}

// Function to display chat messages (both user and GPT) in the chat box
function displayMessage(sender, message) {
    // Get the chat box element where messages will be displayed
    const chatBox = document.getElementById('chat-box');
    
    // Create a new div element to hold the message
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');  // Add a CSS class to style the message
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;  // Format the message

    // Append the message element to the chat box
    chatBox.appendChild(messageElement);
    
    // Scroll to the bottom of the chat box to show the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}
