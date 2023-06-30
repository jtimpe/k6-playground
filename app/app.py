from flask import Flask
import random, time

app = Flask(__name__)


@app.route("/")
def hello_world():
    return {
        'this': 'is',
        'j': ['s', 'o', 'n', '!']
    }


@app.route("/slow")
def slow():
    roll = random.randint(1, 6)
    time.sleep(random.randint(1, 5))

    return {
        'roll': roll
    }


@app.route("/unreliable")
def unreliable():
    roll = random.randint(1, 10)
    time.sleep(random.randint(1, 5))

    if roll > 6:
        return ({'message': 'Your roll was too high'}, 500)

    return {
        'roll': roll
    }


@app.route("/dangerous")
def dangerous():
    roll = random.randint(1, 10)
    last_roll = None

    f = open('rolls.txt', 'r+')
    for line in f.read():
        if line.strip('\n') != '':
            last_roll = int(line.strip('\n'))
    f.close()

    f = open('rolls.txt', 'a')
    f.write('\n' + str(roll))
    time.sleep(random.randint(1, 5))
    f.close()

    return {
        'roll': roll,
        'last_roll': last_roll
    }
