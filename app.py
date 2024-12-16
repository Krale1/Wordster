from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

WORDLIST = ["apple", "brain", "crane", "drain", "eagle"]
SECRET_WORD = random.choice(WORDLIST)  


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/check_word", methods=["POST"])
def check_word():
    user_word = request.json.get("word", "").lower()
    if len(user_word) != 5:
        return jsonify({"error": "Word must be 5 letters long."}), 400

    feedback = []
    for i, char in enumerate(user_word):
        if char == SECRET_WORD[i]:
            feedback.append("correct")
        elif char in SECRET_WORD:
            feedback.append("present")
        else:
            feedback.append("absent")

    win = user_word == SECRET_WORD
    return jsonify({"feedback": feedback, "win": win})


if __name__ == '__main':
    app.run(debug=True)
    