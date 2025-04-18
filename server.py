#build a basic flask server that serves data from ./strong.csv dont use pandas

from flask import Flask, request, jsonify
import pandas as pd
import csv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

df = pd.read_csv('strong.csv')
exercises_list = df['Exercise Name'].unique().tolist()
excercise_ids = {}
for e in exercises_list:
    excercise_ids[len(excercise_ids) + 1] = e
exercise_sets = {}
for exercise in exercises_list:
    exercise_sets[exercise] = []
    for index, row in df[df['Exercise Name'] == exercise].iterrows():
        exercise_sets[exercise].append({'Weight': row['Weight'], 'Reps': row['Reps'], 'Date': row['Date']})

@app.route('/data', methods=['GET'])
def get_data():
    return df.to_json()

@app.route('/data/excercises', methods=['GET'])
def post_data():
    return jsonify(excercise_ids)


@app.route('/data/excercises/<int:excercise_id>', methods=['GET'])
def get_excercise(excercise_id):
    return jsonify({excercise_ids[excercise_id] : exercise_sets[excercise_ids[excercise_id]], "name" : excercise_ids[excercise_id] })

    


if __name__ == '__main__':
    app.run(debug=True)
