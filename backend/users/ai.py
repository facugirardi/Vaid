from g4f.client import Client
import json

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
        
        # Validar que sea un JSON válido antes de convertirlo
        try:
            json_data = json.loads(result)  # Validar JSON
        except json.JSONDecodeError as decode_error:
            print(decode_error)
            raise ValueError(f"Invalid JSON returned: {str(decode_error)}\nResponse was: {result}")

        # Convertir el JSON validado a una cadena de array JS
        js_array = json.dumps(json_data)  # Devuelve una cadena JSON válida compatible con JS
        return js_array
    except Exception as e:
        print(e)
        raise ValueError(f"Error with g4f extraction: {str(e)}")
