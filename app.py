from flask import Flask, render_template, jsonify, request
import random
from functools import wraps

app = Flask(__name__)

def load_words_from_file(filename):
    with open(filename, "r") as file:
        words = [line.strip().lower() for line in file.readlines()]
    return words

WORDLIST = load_words_from_file("words.txt")
SECRET_WORD = random.choice(WORDLIST)

def validate_word(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_word = request.json.get("word", "").lower()
        if len(user_word) != 5:
            return jsonify({"error": "Word must be 5 letters long."}), 400
        return func(user_word, *args, **kwargs)
    return wrapper

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check_word", methods=["POST"])
@validate_word
def check_word(user_word):
    feedback = []
    for i, char in enumerate(user_word):
        if char == SECRET_WORD[i]:
            feedback.append("correct")
        elif char in SECRET_WORD:
            feedback.append("present")
        else:
            feedback.append("absent")

    win = user_word == SECRET_WORD
    return jsonify({"feedback": feedback, "win": win, "secret_word": SECRET_WORD})

if __name__ == '__main__':
    app.run(debug=True)
