from reading import Result
from flask import Flask, render_template, session, redirect, url_for
from reading import Reading, Combination
import os
from flask_wtf import FlaskForm
from listening import Listening

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt


app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir, 'database.db')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'thisissecretkey'
SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.config.update(SECRET_KEY=os.urandom(24))

final_list = []

# Create the User table if it doesn't exist
with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#user DB
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)

class RegisterForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise ValidationError(
                'That username already exists. Please choose a different one.')

class LoginForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')

# @login_manager.user_loader
# def load_user(user_id):
#     return User.query.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('index'))
    return render_template('login.html', form=form)


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))






@app.route("/", methods=['GET', 'POST'])
@login_required
def index():
    return render_template('index.html')


@app.route("/intro-reading")
@login_required
def intro_reading():
    return render_template("intro_reading.html")

@app.route("/intro-listening")
@login_required
def intro_listening():
    return render_template("intro_listening.html")


@app.route("/shortterm-memory-reading")
@login_required
def shortterm_memory_reading():
    list_of_combinations = []
    list_of_results = []
    for i in range(10):
        reading = Reading()
        first_number = reading[0]
        second_number = reading[1]
        first_letter = reading[2]
        second_letter = reading[3]
        result = Result(first_number, second_number, first_letter, second_letter)
        list_of_results.append(result)

        session['key'] = list_of_results
        combination = Combination(first_number, second_number, first_letter, second_letter)
        list_of_combinations.append(combination)


    combinations = {
        'combination': list_of_combinations,
    }
    print(combinations)
    print(type(combinations))

    return render_template('shortterm-memory-reading.html', combinations=combinations)

@app.route("/shortterm-memory-listening")
@login_required
def shortterm_memory_listening():
    final_list = Listening()
    session['listening_key'] = final_list
    print("results: ", final_list[1])
    return render_template('/shortterm-memory-listening.html')



@app.route('/results', methods=["POST"])
@login_required
def form():
    if request.method == 'POST':
        user_inputs = request.form.getlist('input')
        sublist_of_results = session.get('key', None)
        list_of_results = []
        for a in sublist_of_results:
            for item in a:
                list_of_results.append(item)

        missing = list(set(list_of_results)-set(user_inputs))
        print("chybne odpovedi: ", missing)
        final_result = (1 - (len(missing)) / 20) * 100
        final_result = round(final_result, 1)

        if final_result >= 80:
            success_msg = "uspěl(a)"
        elif final_result < 80:
            success_msg = "neuspěl(a)"
        else:
            success_msg = "error"

    return render_template("results.html", user_inputs=user_inputs, combinations=list_of_results, final_result=final_result, success_msg=success_msg)

@app.route('/results_listening', methods=["POST"])
@login_required
def results_listening():
    if request.method == 'POST':
        user_inputs = []
        user_inputs = request.form.getlist('input')
        print("uzivatel zadal ", user_inputs)
        list_of_results = session.get('listening_key', None)
        print("spravne odpovedi: ", list_of_results)

        #missing = list(set(list_of_results)-set(user_inputs))
        missing = 5
        print("chybne odpovedi: ", missing)

        final_result = 30
        final_result = round(final_result, 1)

        if final_result >= 80:
            success_msg = "uspěl(a)"
        elif final_result < 80:
            success_msg = "neuspěl(a)"
        else:
            success_msg = "error"

    for i in range(10):
        os.remove("static/sounds/sound"+str(i)+".mp3")

    return render_template("results_listening.html", user_inputs=user_inputs, combinations=list_of_results, final_result=final_result, success_msg=success_msg)



import flask
from flask import request
from collections import OrderedDict
import random
from datetime import datetime


cmap = OrderedDict()
cmap[0] = "c000"
cmap[1] = "c023"
cmap[2] = "c045"
cmap[3] = "c068"
cmap[4] = "c090"
cmap[5] = "c113"
cmap[6] = "c135"
cmap[7] = "c158"
cmap[8] = "c180"
cmap[9] = "c203"
cmap[10] = "c225"
cmap[11] = "c248"
cmap[12] = "c270"
cmap[13] = "c293"
cmap[14] = "c315"
cmap[15] = "c338"

ONE_STEP_PROB = 0.90
cntr_circles = 0
cntr_two_steps = 0
cntr_two_steps_user_ok = 0
cntr_two_steps_user_nok = 0
two_step = False


@app.route("/concentration_circle")
@login_required
def concentration_circle():
    return flask.render_template('concentration_circle.html')


@app.route('/testdata')
@login_required
def test_data():
    print('was queried')
    return "Test data from flask!"


@app.route('/highlight_id')
@login_required
def highlight_id():
    global cntr_circles
    global cmap
    global two_step
    global cntr_two_steps

    cntr_old = cntr_circles
    two_step = False

    if random.random() > ONE_STEP_PROB:
        # two steps
        two_step = True
        cntr_two_steps += 1
        if (cntr_circles + 2) > max(list(cmap.keys())):
            cntr_circles = 0
        else:
            cntr_circles += 2
    else:
        # one step
        if (cntr_circles + 1) > max(list(cmap.keys())):
            cntr_circles = 0
        else:
            cntr_circles += 1

    print('returning ' + cmap[cntr_old] + " -> " + cmap[cntr_circles] + "(" + str(two_step) + ")")
    return cmap[cntr_old] + " " + cmap[cntr_circles] + " " + str(two_step)


@app.route('/register_two_step', methods=['POST'])
@login_required
def register_two_step():
    global two_step
    global cntr_two_steps
    global cntr_two_steps_user_ok
    global cntr_two_steps_user_nok

    req_data = request.get_data().decode()
    # if req_data != "":
    #     print('Something wrong happened, received post request {} instead of \'\''.format(req_data))
    #     return "NOK"

    print('Registered two step [{}, {}]'.format(datetime.now().isoformat(), req_data))
    if two_step:
        cntr_two_steps_user_ok += 1
    else:
        cntr_two_steps_user_nok += 1

    ret = {
        'total': cntr_two_steps,
        'ok': cntr_two_steps_user_ok,
        'nok': cntr_two_steps_user_nok
    }

    return ret


@app.route('/reset_counters', methods=['POST'])
@login_required
def reset_counters():
    global cntr_two_steps
    global cntr_two_steps_user_ok
    global cntr_two_steps_user_nok

    cntr_two_steps = 0
    cntr_two_steps_user_ok = 0
    cntr_two_steps_user_nok = 0

    return "counters reset"


@app.route('/get_stats')
@login_required
def get_stats():
    global cntr_two_steps
    global cntr_two_steps_user_ok
    global cntr_two_steps_user_nok

    ret = {
        'total': cntr_two_steps,
        'ok': cntr_two_steps_user_ok,
        'nok': cntr_two_steps_user_nok
    }

    return ret

# grid
SYMBOLS = ['*', '#', '$', '&', '@']
GRID_SIZE = 12

def generate_grid():
    """Generate a random grid of symbols."""
    grid = [[random.choice(SYMBOLS) for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    return grid

def get_symbol_location(grid):
    """Get the location of the symbol displayed to the user."""
    row = random.randint(0, GRID_SIZE - 1)
    col = random.randint(0, GRID_SIZE - 1)
    symbol = grid[row][col]
    return row, col, symbol


@app.route('/play', methods=['GET', 'POST'])
@login_required
def play():

    # Render play template with grid
    return render_template('play.html')


#IQ

iqs = [
    {"question": " 2, 1, (1/2), (1/4), ...", "answer": "1/8"},
    {"question": " 7, 10, 8, 11, 9, 12, ...", "answer": "10"},
    {"question": " 36, 34, 30, 28, 24, ...", "answer": "22"},
    {"question": " 22, 21, 23, 22, 24, 23, ...", "answer": "25"},
    {"question": " 53, 53, 40, 40, 27, 27, ... ", "answer": "14"},
    {"question": " 21, 9, 21, 11, 21, 13, 21, ...", "answer": "15"},
    {"question": " 58, 52, 46, 40, 34, ...", "answer": "28"},
    {"question": " 3, 4, 7, 8, 11, 12, ...", "answer": "10"},
    {"question": " 8, 22, 8, 28, 8, ...", "answer": "34"},
    {"question": " 31, 29, 24, 22, 17, ... ", "answer": "15"},
    {"question": " 1.5, 2.3, 3.1, 3.9, ...", "answer": "4.7"},
    {"question": " 14, 28, 20, 40, 32, 64, ...", "answer": "56"},
    {"question": " 2, 4, 6, 8, 10, ...  ", "answer": "12"},
    {"question": " 201, 202, 204, 207, ...", "answer": "208"},
    {"question": " 544, 509, 474, 439, ...", "answer": "404"},
    {"question": " 80, 10, 70, 15, 60, ...", "answer": "20"},
    {"question": " 2, 6, 18, 54, ... ", "answer": "162"},
    {"question": " 5.2, 4.8, 4.4, 4, ...", "answer": "3.6"},
    {"question": " 8, 6, 9, 23, 87 , ... ", "answer": "429"}



]

# Global variables to keep track of user's score
correct_answers = 0
incorrect_answers = 0
iq_final_score = 0


@app.route('/iq')
@login_required
def iq():
    iq_final_score = 0
    return render_template('iq.html', question=iqs[0]['question'])


@app.route('/answer', methods=['POST'])
@login_required
def answer():
    global correct_answers, incorrect_answers, iq_final_score
    user_answer = request.form['answer']
    correct_answer = maths[0]['answer']

    if user_answer.lower() == correct_answer.lower():
        correct_answers += 1
    else:
        incorrect_answers += 1

    if len(iqs) == 1:
        return redirect(url_for('iq_final_score'))
    else:
        iqs.pop(0)
        return redirect(url_for('iq'))


@app.route('/iq_final_score')
@login_required
def iq_final_score():
    global correct_answers, incorrect_answers
    iq_final_score = (correct_answers / 10) * 100
    return render_template('iq_final_score.html', correct=correct_answers, incorrect=incorrect_answers, score=iq_final_score)

#mathematics

# List of questions and their corresponding options and correct answers
maths = [
    {"question": "238 x 564", "options": ["134232", "73256", "12478"], "answer": "134232"},
    {"question": "652 x 42", "options": ["64778", "27384", "112386"], "answer": "27384"},
    {"question": "14 x 144", "options": ["202", "1424", "2016"], "answer": "2016"},
    {"question": "89 x 89", "options": ["11589", "178", "362"], "answer": "178"},
    {"question": "1456 x 488", "options": ["2478962", "710528", "42158"], "answer": "710528"},
    {"question": "5145 x 43", "options": ["221235", "27394", "112486"], "answer": "221235"},
    {"question": "3666 x 874", "options": ["3204084", "240563", "100052"], "answer": "3204084"},
    {"question": "1111 x 111", "options": ["111111", "123456", "123321"], "answer": "123321"},
    {"question": "4569 x 455", "options": ["207895", "2078895", "78600"], "answer": "2078895"},
    {"question": "17 x 17", "options": ["1052", "366", "289"], "answer": "289"},
    {"question": "2455 x 255 ", "options": ["64560", "45788", "626025"], "answer": "626025"},

    # Add more questions here...
]

# @app.route('/math/<int:math_num>', methods=['GET', 'POST'])
# @login_required
# def math(math_num):
#     if 'score' not in session:
#         session['score'] = 0
#     if math_num < len(maths):
#         if request.method == 'POST':
#             user_answer_index = int(request.form['answer'])
#             correct_answer_index = maths[math_num]['options'].index(maths[math_num]['answer'])
#             if user_answer_index == correct_answer_index:
#                 session['score'] += 1
#             return redirect(url_for('math', math_num=math_num + 1))  # Change 'math_question' to 'math'
#         return render_template('math.html', math=maths[math_num]['question'], options=maths[math_num]['options'])
#     else:
#         return redirect(url_for('math_final_score'))
#
# @app.route('/math_final_score')
# @login_required
# def math_final_score():
#     math_final_score = session.get('score', 0)
#     session.pop('score', None)  # Clear the score after displaying it
#     return render_template('math_final_score.html', math_final_score=math_final_score)

if __name__ == "__main__":
    app.debug= True
    app.run(host = '0.0.0.0', port = 5000)
