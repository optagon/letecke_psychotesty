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
app.config['SECRET_KEY'] = 'flaps15positiverategearup'
SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

app.config.update(SECRET_KEY=os.urandom(24))

final_list = []

# Create the User table if it doesn't exist
with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

#user DB
class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    valid_from = db.Column(db.Date, nullable=False)
    valid_to = db.Column(db.Date, nullable=False)



class LoginForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Přihlašovací jméno"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Heslo"})

    submit = SubmitField('Přihlásit')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
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
    return render_template('pages/index.html')


@app.route("/intro-reading")
@login_required
def intro_reading():
    return render_template("pages/instructions/intro_reading.html")

@app.route("/intro-listening")
@login_required
def intro_listening():
    return render_template("pages/instructions/intro_listening.html")


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

    return render_template('pages/shortterm-memory-reading.html', combinations=combinations)

@app.route("/shortterm-memory-listening")
@login_required
def shortterm_memory_listening():
    final_list = Listening()
    session['listening_key'] = final_list
    print("results: ", final_list[1])
    return render_template('pages/shortterm-memory-listening.html')



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

    return render_template("pages/results.html", user_inputs=user_inputs, combinations=list_of_results, final_result=final_result, success_msg=success_msg)

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

    return render_template("pages/results_listening.html", user_inputs=user_inputs, combinations=list_of_results, final_result=final_result, success_msg=success_msg)



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
    return flask.render_template('pages/concentration_circle.html')



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


@app.route('/photo_memory', methods=['GET', 'POST'])
@login_required
def photographic_memory():
    # Render play template with grid
    return render_template('pages/photographic_memory.html')


@app.route('/iq')
@login_required
def iq():
    return render_template('pages/iq.html')


@app.route("/circles")
def circles():
    return render_template("pages/circles.html")

@app.route("/rectangles")
def rectangles():
    return render_template("pages/rectangles.html")

@app.route('/math')
@login_required
def math():
    return render_template('pages/math.html')

@app.route('/kombajn')
@login_required
def kombajn():
    return render_template('pages/kombajn.html')

@app.route('/pizza')
@login_required
def pizza():
    return render_template('pages/pizza.html')

@app.route("/about")
@login_required
def about():
    return render_template("pages/about.html")

# intro pages routes
@app.route("/intro_circles")
@login_required
def intro_circles():
    return render_template("pages/instructions/intro_circles.html")

@app.route('/intro_photo_memory')
@login_required
def intro_photographic_memory():
    return render_template('pages/instructions/intro_photo_memory.html')

@app.route('/intro_iq')
@login_required
def intro_iq():
    return render_template('pages/instructions/intro_iq.html')

@app.route('/intro_ctverecky')
@login_required
def intro_ctverecky():
    return render_template('pages/instructions/intro_ctverecky.html')

@app.route('/intro_math')
@login_required
def intro_math():
    return render_template('pages/instructions/intro_math.html')

@app.route('/intro_kombajn')
@login_required
def intro_kombajn():
    return render_template('pages/instructions/intro_kombajn.html')

@app.route('/intro_pizza')
@login_required
def intro_pizza():
    return render_template('pages/instructions/intro_pizza.html')


if __name__ == "__main__":
    app.debug= True
    app.run(host = '0.0.0.0', port = 5000)
