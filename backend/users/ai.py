from g4f.client import Client

def extract_person_info(text):
    client = Client()
    prompt = (
        "Please extract all names, surnames, and emails of individuals found in the following text. "
        "Return only the information in strict JSON format as an array of objects, each containing 'first_name', 'last_name', and 'email'. "
        "Do not include any additional text, explanations, or formatting characters such as backticks. "
        "Only output the JSON array itself with no extra characters.\n\n"
        f"{text}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        result = response.choices[0].message.content.strip()
        extracted_data = eval(result)  # Convierte el resultado en una lista de diccionarios
        return extracted_data
    except Exception as e:
        raise ValueError(f"Error with g4f extraction: {str(e)}")
