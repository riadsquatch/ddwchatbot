const live = 'https://flask-ddw-doc-chatbot-8b68c120b193.herokuapp.com/get_response'
const local = 'http://127.0.0.1:5000/get_response'

export const askQuestion = async (question, apiKey) => {
    try {
        const response = await fetch(live, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${apiKey}`
            },
            body: JSON.stringify({question})
        })
        const data = await response.json()
        const responseText = data.response
        return responseText
    } catch (error) {
        console.error(error)
    }
}

